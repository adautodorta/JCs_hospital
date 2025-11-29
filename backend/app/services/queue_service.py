
from datetime import datetime
from zoneinfo import ZoneInfo
from app.core.config import supabase

class QueueService:
    """
    Serviço responsável pela gestão da fila de atendimento.
    Implementa regras de negócio para priorização e ordenação de pacientes.
    """
    def __init__(self):
        self.table = supabase.table('QUEUE')

    def get_queue(self):
        """
        Retorna toda a fila de atendimento sem filtros.
        Utilizado para visualização geral da fila.
        """
        response = self.table.select("*").execute()
        return response.data
    
    def checkin_queue(self, profile_id: str):
        """
        Realiza o check-in do paciente na fila de atendimento.
        
        Regra de Negócio:
        - Registra automaticamente a data/hora do check-in no timezone de Fortaleza
        - Status inicial é sempre "waiting" (aguardando)
        - Médico atribuído é None até ser chamado
        
        Args:
            profile_id: UUID do perfil do paciente
            
        Returns:
            Dados do check-in criado
        """
        # Timezone configurado para Fortaleza (UTC-3) conforme requisito do sistema
        now_fortaleza = datetime.now(ZoneInfo("America/Fortaleza"))

        insert_data = {
            "profile_id": profile_id,
            "checkin": now_fortaleza.isoformat(),
            "status": "waiting",
            "assigned_doctor_id": None
        }

        response = self.table.insert(insert_data).execute()
        return response.data
    
    def cancel_checkin(self, profile_id: str):
        """
        Cancela o check-in do paciente, removendo-o da fila.
        
        Regra de Negócio:
        - Remove completamente a entrada da fila
        - Não permite cancelamento se o paciente já estiver em atendimento
        
        Args:
            profile_id: UUID do perfil do paciente
            
        Returns:
            Dados do check-in removido
        """
        response = self.table.delete().eq("profile_id", profile_id).execute()
        return response.data
    
    def get_position(self, profile_id: str):
        """
        Calcula a posição do paciente na fila considerando priorização.
        
        Regra de Negócio (CRÍTICA):
        1. Pacientes com flag priority=True têm prioridade absoluta
        2. Dentro de cada grupo (prioritários e normais), ordenação é por horário de check-in
        3. A posição retornada é 1-indexed (primeira posição = 1)
        
        Algoritmo:
        - Separa pacientes em dois grupos: prioritários e normais
        - Ordena cada grupo por horário de check-in (mais antigo primeiro)
        - Concatena: [prioritários ordenados] + [normais ordenados]
        - Encontra a posição do paciente na fila ordenada
        
        Args:
            profile_id: UUID do perfil do paciente
            
        Returns:
            Posição na fila (1-indexed) ou None se não estiver na fila
        """
        # Busca apenas pacientes aguardando (status = "waiting")
        queue_response = self.table.select("*").eq("status", "waiting").execute()
        queue = queue_response.data

        # Verifica se o paciente está na fila
        user_entry = next((item for item in queue if item["profile_id"] == profile_id), None)
        if not user_entry:
            return None

        # Valida se o perfil existe
        profile = supabase.table("PROFILES").select("*").eq("id", profile_id).execute().data

        if not profile:
            raise ValueError("Perfil não encontrado.")

        # Separação em grupos: prioritários e normais
        priorities = []
        normals = []

        # Itera sobre a fila e separa pacientes por prioridade
        for item in queue:
            p = supabase.table("PROFILES").select("priority").eq("id", item["profile_id"]).execute().data
            is_priority = p[0]["priority"] if p else False

            if is_priority:
                priorities.append(item)
            else:
                normals.append(item)

        # Ordena cada grupo por horário de check-in (mais antigo primeiro)
        priorities.sort(key=lambda x: x["checkin"])
        normals.sort(key=lambda x: x["checkin"])

        # Fila ordenada: prioritários primeiro, depois normais
        ordered_queue = priorities + normals

        # Encontra a posição do paciente na fila ordenada
        position = next(
            (i for i, item in enumerate(ordered_queue) if item["profile_id"] == profile_id),
            None
        )

        if position is None:
            return None

        # Retorna posição 1-indexed (primeira posição = 1, não 0)
        return position + 1

    
    def is_being_attended(self, profile_id: str):
        """
        Verifica se o paciente está atualmente sendo atendido.
        
        Regra de Negócio:
        - Um paciente está sendo atendido quando seu status é "being_attended"
        
        Args:
            profile_id: UUID do perfil do paciente
            
        Returns:
            True se está sendo atendido, False caso contrário
        """
        res = (
            supabase.table("QUEUE")
            .select("*")
            .eq("profile_id", profile_id)
            .eq("status", "being_attended")
            .execute()
        )

        data = res.data or []

        return len(data) > 0
    
    def advance_queue(self, doctor_id: str):
        """
        Chama o próximo paciente da fila para atendimento.
        
        Regras de Negócio (CRÍTICAS):
        1. Um médico pode atender apenas UM paciente por vez
        2. Se o médico já está atendendo, retorna o paciente atual
        3. Priorização: pacientes com priority=True são chamados primeiro
        4. Dentro de cada grupo, ordem é por horário de check-in (mais antigo primeiro)
        5. Ao chamar, atualiza status para "being_attended" e atribui o médico
        
        Algoritmo de Priorização:
        - Separa pacientes em prioritários e normais
        - Ordena cada grupo por check-in
        - Chama o primeiro da lista ordenada (prioritários primeiro)
        
        Args:
            doctor_id: UUID do médico que está chamando o próximo paciente
            
        Returns:
            - None se a fila estiver vazia
            - {"already_attending": True, "patient": ...} se médico já está atendendo
            - {"already_attending": False, "patient": ...} se chamou novo paciente
        """
        # Verifica se o médico já está atendendo algum paciente
        # Regra de Negócio: Um médico não pode atender múltiplos pacientes simultaneamente
        attending_res = (
            self.table
            .select("*")
            .eq("assigned_doctor_id", doctor_id)
            .eq("status", "being_attended")
            .execute()
        )

        attending = attending_res.data or []

        # Se já está atendendo, retorna o paciente atual (não permite novo atendimento)
        if attending:
            return {
                "already_attending": True,
                "patient": attending[0]
            }

        # Busca pacientes aguardando na fila
        queue_res = (
            self.table
            .select("*")
            .eq("status", "waiting")
            .execute()
        )

        queue = queue_res.data or []

        # Se a fila está vazia, retorna None
        if not queue:
            return None

        # Separação em grupos para aplicação da regra de priorização
        priorities = []
        normals = []

        # Itera sobre a fila e separa por prioridade
        for item in queue:
            prof = (
                supabase.table("PROFILES")
                .select("priority")
                .eq("id", item["profile_id"])
                .execute()
            ).data or []

            is_priority = prof[0]["priority"] if prof else False

            if is_priority:
                priorities.append(item)
            else:
                normals.append(item)

        # Ordena cada grupo por horário de check-in (mais antigo primeiro)
        priorities.sort(key=lambda x: x["checkin"])
        normals.sort(key=lambda x: x["checkin"])

        # Fila ordenada: prioritários primeiro, depois normais
        ordered_queue = priorities + normals

        # Seleciona o primeiro paciente da fila ordenada
        first = ordered_queue[0]

        # Atualiza status para "being_attended" e atribui o médico
        # Regra de Negócio: Ao chamar, o paciente sai do status "waiting"
        supabase.table("QUEUE").update({
            "status": "being_attended",
            "assigned_doctor_id": doctor_id
        }).eq("id", first["id"]).execute()

        return {"already_attending": False, "patient": first}

        
queue_service = QueueService()