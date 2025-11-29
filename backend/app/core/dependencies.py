from fastapi import Header, HTTPException, status
from .config import supabase

def get_current_user(authorization: str = Header(..., description="Bearer JWT do Supabase")) -> str:
    """
    Valida o JWT com o Supabase e retorna o ID do usuário.
    
    Regra de Segurança (CRÍTICA):
    - Todas as rotas protegidas dependem desta função
    - Valida o token JWT antes de permitir acesso
    - Retorna 401 se token inválido, ausente ou expirado
    
    Fluxo de Autenticação:
    1. Extrai token do header Authorization
    2. Valida formato (deve ser "Bearer <token>")
    3. Valida token com Supabase Auth
    4. Retorna UUID do usuário se válido
    
    Args:
        authorization: Header HTTP com formato "Bearer <token>"
        
    Returns:
        UUID do usuário autenticado
        
    Raises:
        HTTPException 401: Se token inválido, ausente ou expirado
    """
    # Validação do formato do header
    # Regra: Deve seguir o padrão "Bearer <token>"
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso ausente ou formato incorreto (deve ser 'Bearer <token>').",
        )
    
    # Extrai o token do header (remove "Bearer ")
    token = authorization.split(" ")[1]

    try:
        # Valida o token com Supabase Auth
        # Se válido, retorna os dados do usuário incluindo o ID
        user_response = supabase.auth.get_user(token)
        return user_response.user.id
        
    except Exception as e:
        # Token inválido, expirado ou erro na validação
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido ou expirado. Detalhe: {e}",
        )