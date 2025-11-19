
from datetime import datetime
from zoneinfo import ZoneInfo
from app.core.config import supabase

class QueueService:
    def __init__(self):
        self.table = supabase.table('QUEUE')

    def get_queue(self):
        response = self.table.select("*").execute()
        return response.data
    
    def checkin_queue(self, profile_id: str):
        now_fortaleza = datetime.now(ZoneInfo("America/Fortaleza"))

        insert_data = {
            "profile_id": profile_id,
            "checkin": now_fortaleza.isoformat()
        }

        response = self.table.insert(insert_data).execute()
        return response.data
    
    def cancel_checkin(self, profile_id: str):
        response = self.table.delete().eq("profile_id", profile_id).execute()
        return response.data
    
    def get_position(self, profile_id: str):
        queue_response = self.table.select("*").execute()
        queue = queue_response.data

        user_entry = next((item for item in queue if item["profile_id"] == profile_id), None)
        if not user_entry:
            return "called"

        profile = supabase.table("PROFILES").select("*").eq("id", profile_id).execute().data

        if not profile:
            raise ValueError("Perfil não encontrado.")

        user_priority = profile[0].get("priority", False)

        priorities = []
        normals = []

        for item in queue:
            p = supabase.table("PROFILES").select("priority").eq("id", item["profile_id"]).execute().data
            is_priority = p[0]["priority"] if p else False

            if is_priority:
                priorities.append(item)
            else:
                normals.append(item)

        priorities.sort(key=lambda x: x["checkin"])
        normals.sort(key=lambda x: x["checkin"])

        ordered_queue = priorities + normals

        position = next((i for i, item in enumerate(ordered_queue) if item["profile_id"] == profile_id), None)

        return position + 1
    
    def advance_queue(self, doctor_id: str):
        queue_response = self.table.select("*").execute()
        queue = queue_response.data

        if not queue:
            return None

        priorities = []
        normals = []

        for item in queue:
            profile_res = (
                supabase.table("PROFILES")
                .select("priority")
                .eq("id", item["profile_id"])
                .execute()
                .data
            )
            is_priority = profile_res[0]["priority"] if profile_res else False

            if is_priority:
                priorities.append(item)
            else:
                normals.append(item)

        priorities.sort(key=lambda x: x["checkin"])
        normals.sort(key=lambda x: x["checkin"])

        ordered_queue = priorities + normals

        # primeiro da fila
        first = ordered_queue[0]
        patient_id = first["profile_id"]

        # remove da fila
        self.table.delete().eq("id", first["id"]).execute()

        # cria current attendance
        now = datetime.now(ZoneInfo("America/Fortaleza")).isoformat()

        supabase.table("CURRENT_ATTENDANCE").insert({
            "doctor_id": doctor_id,
            "patient_id": patient_id,
            "started_at": now
        }).execute()

        return first
        
queue_service = QueueService()