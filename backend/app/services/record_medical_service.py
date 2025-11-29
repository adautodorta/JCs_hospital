from app.core.config import supabase

class MedicalRecordService:
    """
    Serviço responsável pelo gerenciamento de registros médicos.
    
    Regras de Negócio:
    - Registros médicos são permanentes e não podem ser alterados após criação
    - Utilizam metodologia SOAP (Subjective, Objective, Assessment, Planning)
    - Ordenação padrão é por data de início (mais antigo primeiro)
    """
    def __init__(self):
        self.records = supabase.table("RECORD_MEDICAL")

    def list_all(self):
        """
        Lista todos os registros médicos do sistema.
        
        Regra de Negócio:
        - Ordenação por data de início (mais antigo primeiro)
        - Utilizado para visualização geral (ex: dashboard de admin)
        
        Returns:
            Lista de todos os registros médicos ordenados
        """
        response = (
            self.records
            .select("*")
            .order("started_at", desc=False)  # Mais antigo primeiro
            .execute()
        )
        return response.data or []

    def list_by_profile(self, profile_id: str):
        """
        Lista todos os registros médicos de um paciente específico.
        
        Regra de Negócio:
        - Retorna histórico completo de atendimentos do paciente
        - Ordenação por data de início (mais antigo primeiro)
        - Utilizado para visualizar histórico médico do paciente
        
        Args:
            profile_id: UUID do perfil do paciente
            
        Returns:
            Lista de registros médicos do paciente ordenados
        """
        response = (
            self.records
            .select("*")
            .eq("patient_id", profile_id)
            .order("started_at", desc=False)  # Mais antigo primeiro
            .execute()
        )
        return response.data or []

    def get_by_id(self, record_id: str):
        """
        Busca um registro médico específico por ID.
        
        Regra de Negócio:
        - Registro deve existir no banco de dados
        - Utilizado para visualizar detalhes completos de um atendimento
        
        Args:
            record_id: UUID do registro médico
            
        Returns:
            Dados completos do registro médico
        """
        response = (
            self.records
            .select("*")
            .eq("id", record_id)
            .single()
            .execute()
        )
        return response.data
