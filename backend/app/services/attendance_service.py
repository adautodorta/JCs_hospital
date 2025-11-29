from datetime import datetime
from zoneinfo import ZoneInfo
from app.core.config import supabase


class AttendanceService:
    """
    Serviço responsável pelo gerenciamento de atendimentos médicos.
    Implementa a lógica de criação de registros médicos usando metodologia SOAP.
    """
    def __init__(self):
        self.records = supabase.table("RECORD_MEDICAL")
        self.queue = supabase.table("QUEUE")

    def get_current_attendance(self, doctor_id: str):
        """
        Retorna o atendimento ativo do médico.
        
        Regra de Negócio:
        - Um médico pode ter apenas um atendimento ativo por vez
        - Status deve ser "being_attended"
        
        Args:
            doctor_id: UUID do médico
            
        Returns:
            Dados do atendimento ativo ou None se não houver
        """
        response = (
            self.queue
            .select("*")
            .eq("assigned_doctor_id", doctor_id)
            .in_("status", ["being_attended"])
            .execute()
        )

        entry = response.data[0] if response.data else None

        if entry:
            # Garante que o status está correto
            self.queue.update({"status": "being_attended"}) \
                .eq("id", entry["id"]) \
                .execute()

        return entry

    def finish_attendance(
        self,
        doctor_id: str,
        subjective: str,
        objective_data: str,
        assessment: str,
        planning: str
    ):
        """
        Finaliza um atendimento e cria o registro médico completo.
        
        Regras de Negócio (CRÍTICAS):
        1. Apenas médicos podem finalizar atendimentos
        2. Deve existir um atendimento ativo para o médico
        3. Utiliza metodologia SOAP (Subjective, Objective, Assessment, Planning)
        4. Ao finalizar, cria registro médico permanente
        5. Remove o paciente da fila após criar o registro
        6. Data de início vem do check-in, data de fim é o momento atual
        
        Metodologia SOAP:
        - Subjective: Dados subjetivos (queixas, histórico relatado pelo paciente)
        - Objective: Dados objetivos (sinais vitais, exames, observações clínicas)
        - Assessment: Avaliação e diagnóstico
        - Planning: Plano de tratamento e recomendações
        
        Args:
            doctor_id: UUID do médico que está finalizando
            subjective: Dados subjetivos do paciente
            objective_data: Dados objetivos (sinais vitais, exames)
            assessment: Avaliação e diagnóstico
            planning: Plano de tratamento
            
        Returns:
            Registro médico criado
            
        Raises:
            ValueError: Se não houver atendimento ativo
        """
        # Busca atendimento ativo do médico
        # Regra: Médico só pode finalizar seu próprio atendimento ativo
        response = (
            self.queue
            .select("*")
            .eq("assigned_doctor_id", doctor_id)
            .eq("status", "being_attended")
            .execute()
        )

        current = response.data[0] if response.data else None

        # Validação: Deve existir atendimento ativo
        if not current:
            raise ValueError("Nenhum atendimento ativo encontrado.")

        # Timestamp de finalização no timezone de Fortaleza
        now = datetime.now(ZoneInfo("America/Fortaleza")).isoformat()

        # Criação do registro médico com metodologia SOAP
        # Regra: Registro médico é permanente e não pode ser alterado após criação
        record_data = {
            "doctor_id": doctor_id,
            "patient_id": current["profile_id"],
            "started_at": current["checkin"],  # Data de início vem do check-in
            "end_at": now,  # Data de fim é o momento atual
            "subjective": subjective,  # SOAP: Subjective
            "objective_data": objective_data,  # SOAP: Objective
            "assessment": assessment,  # SOAP: Assessment
            "planning": planning,  # SOAP: Planning
        }

        # Insere o registro médico no banco de dados
        record = self.records.insert(record_data).execute().data[0]

        # Remove o paciente da fila após criar o registro
        # Regra: Após finalizar, o paciente não fica mais na fila
        self.queue.delete().eq("id", current["id"]).execute()

        return record


attendance_service = AttendanceService()
