"""
Configurações e inicialização do cliente Supabase.

Este módulo é responsável por:
- Carregar variáveis de ambiente
- Configurar settings da aplicação
- Inicializar cliente Supabase para acesso ao banco de dados
"""
from pydantic_settings import BaseSettings
from supabase import create_client, Client
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

class Settings(BaseSettings):
    """
    Configurações da aplicação.
    
    Variáveis obrigatórias (devem estar no .env):
    - SUPABASE_URL: URL do projeto Supabase
    - SUPABASE_KEY: Chave de API do Supabase (service_role key)
    
    Variáveis opcionais (têm valores padrão):
    - PROJECT_NAME: Nome do projeto
    - VERSION: Versão da aplicação
    """
    SUPABASE_URL: str
    SUPABASE_KEY: str
    PROJECT_NAME: str = "JCS Hospital"
    VERSION: str = "1.0.0"

# Instância global de configurações
settings = Settings()

# Inicialização do cliente Supabase
# Cliente utilizado em todos os serviços para acesso ao banco de dados
# Regra: Cliente deve ser inicializado apenas uma vez e reutilizado
try:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
except Exception as e:
    # Erro crítico: aplicação não pode funcionar sem conexão com Supabase
    print(f"Erro ao inicializar o cliente Supabase: {e}")