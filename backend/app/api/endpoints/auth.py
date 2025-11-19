from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user

router = APIRouter(tags=["Usuário"], prefix="/user")

@router.get(
    "/me", 
    summary="Obter informações básicas do usuário autenticado.",
    description="Esta rota valida o JWT fornecido pelo cliente Supabase e retorna o ID do usuário.",
)
def read_current_user(user_id: str = Depends(get_current_user)):
    """
    Rota protegida. O 'user_id' é preenchido pela função 'get_current_user' se o token for válido.
    """
    return {
        "user_id": user_id,
        "message": "Autenticação bem-sucedida! O Supabase validou seu token (JWT).",
        "seguranca": "Rota protegida com sucesso."
    }
