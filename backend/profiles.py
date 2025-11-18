import os
from supabase_config import supabase, TABLE_PROFILES
from typing import List, Dict, Optional

def get_all_profiles() -> List[Dict]:
    """
    Busca todos os itens da lista de desejos de um usuário específico
    """
    try:
        response = supabase.table(TABLE_PROFILES).select("*").execute()
        return response.data
    except Exception as e:
        print(f"Erro ao buscar profiles: {e}")
        return []
