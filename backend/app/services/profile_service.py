from app.core.config import supabase

class ProfileService:
    def __init__(self):
        self.table = supabase.table('PROFILES')

    def get_all_profiles(self):
        response = self.table.select("*").execute()
        return response.data
    
    def get_profile(self, profile_id: str):
        response = (
            self.table
            .select("*")
            .eq("id", profile_id)
            .execute()
        )

        return response.data[0] if response.data else None
        
profile_service = ProfileService()