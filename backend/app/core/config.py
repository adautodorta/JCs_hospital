from pydantic_settings import BaseSettings
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    PROJECT_NAME: str = "JCS Hospital"
    VERSION: str = "1.0.0"

settings = Settings()

try:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
except Exception as e:
    print(f"Erro ao inicializar o cliente Supabase: {e}")