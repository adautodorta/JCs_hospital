"""
Aplicação principal do backend JCS Hospital.

Este módulo configura e inicializa a aplicação FastAPI com:
- Configuração de CORS para permitir requisições do frontend
- Rotas da API organizadas em módulos
- Health check endpoint para monitoramento
"""
from fastapi import FastAPI
from app.api import api_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
import os
import uvicorn

# Criação da aplicação FastAPI
# Configuração de metadados para documentação automática (Swagger/OpenAPI)
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend com FastAPI e Supabase"
)

# Configuração de CORS (Cross-Origin Resource Sharing)
# Permite que o frontend (hospedado em domínio diferente) faça requisições
# Regra: Em produção, deve-se restringir allow_origins para domínios específicos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens (desenvolvimento)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP
    allow_headers=["*"],   # Permite todos os headers
)

# Inclusão das rotas da API
# Todas as rotas estão organizadas em módulos dentro de app/api/endpoints/
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def health_check():
    """
    Endpoint de health check.
    
    Utilizado para verificar se a API está funcionando.
    Retorna status OK se a aplicação está rodando.
    """
    return {"status": "ok", "message": "API está funcionando! Acesse /docs para a documentação."}

if __name__ == "__main__":
    # Configuração para execução local
    # Porta padrão: 8000, pode ser sobrescrita pela variável de ambiente PORT
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)