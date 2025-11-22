from app.core.config import supabase

class ProfileService:
    def __init__(self):
        self.table = supabase.table('PROFILES')

    def get_all_profiles(self):
        response = self.table.select("*").execute()
        return response.data
    
    def get_profile(self, profile_id: str):
        if not profile_id:
            raise ValueError("profile_id is required")
        
        response = (
            self.table
            .select("*")
            .eq("id", profile_id)
            .single()
            .execute()
        )

        if response.error:
            if "No rows" in response.error.message:
                return None

            raise Exception(response.error.message)

        return response.data
        
profile_service = ProfileService()