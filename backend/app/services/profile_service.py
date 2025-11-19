from app.core.config import supabase

class ProfileService:
    def __init__(self):
        self.table = supabase.table('PROFILES')

    def get_all_profiles(self):
        response = self.table.select("*").execute()
        
        return response.data
        
profile_service = ProfileService()