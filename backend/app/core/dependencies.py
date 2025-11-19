from fastapi import Header, HTTPException, status
from .config import supabase

def get_current_user(authorization: str = Header(..., description="Bearer JWT do Supabase")) -> str:
    """
    Valida o JWT com o Supabase e retorna o ID do usuário.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso ausente ou formato incorreto (deve ser 'Bearer <token>').",
        )
    
    token = authorization.split(" ")[1]

    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user.id
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido ou expirado. Detalhe: {e}",
        )