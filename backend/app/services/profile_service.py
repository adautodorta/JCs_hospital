from app.core.config import supabase

class ProfileService:
    """
    Serviço responsável pelo gerenciamento de perfis de usuários.
    Perfis contêm informações pessoais e definem o papel do usuário no sistema.
    """
    def __init__(self):
        self.table = supabase.table('PROFILES')

    def get_all_profiles(self):
        """
        Retorna todos os perfis cadastrados no sistema.
        Utilizado para listagem geral (ex: dashboard de admin).
        """
        response = self.table.select("*").execute()
        return response.data
    
    def get_profile(self, profile_id: str):
        """
        Busca um perfil específico por ID.
        
        Regra de Negócio:
        - Perfil deve existir no banco de dados
        - ID é obrigatório (validação)
        
        Args:
            profile_id: UUID do perfil
            
        Returns:
            Dados do perfil encontrado
            
        Raises:
            ValueError: Se profile_id não for fornecido
        """
        # Validação: ID é obrigatório
        if not profile_id:
            raise ValueError("profile_id is required")

        response = (
            self.table
            .select("*")
            .eq("id", profile_id)
            .single()
            .execute()
        )

        return response.data

        
profile_service = ProfileService()