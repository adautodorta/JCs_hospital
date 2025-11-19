from app.core.config import supabase

class MedicalRecordService:
    def __init__(self):
        self.records = supabase.table("RECORD_MEDICAL")

    def list_all(self):
        response = (
            self.records
            .select("*")
            .order("started_at", desc=False)
            .execute()
        )
        return response.data or []

    def list_by_profile(self, profile_id: str):
        response = (
            self.records
            .select("*")
            .eq("patient_id", profile_id)
            .order("started_at", desc=False)
            .execute()
        )
        return response.data or []

    def get_by_id(self, record_id: str):
        response = (
            self.records
            .select("*")
            .eq("id", record_id)
            .single()
            .execute()
        )
        return response.data
