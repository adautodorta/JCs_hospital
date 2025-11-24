
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
            "checkin": now_fortaleza.isoformat(),
            "status": "waiting",
            "assigned_doctor_id": None
        }

        response = self.table.insert(insert_data).execute()
        return response.data
    
    def cancel_checkin(self, profile_id: str):
        response = self.table.delete().eq("profile_id", profile_id).execute()
        return response.data
    
    def get_position(self, profile_id: str):
        queue_response = self.table.select("*").eq("status", "waiting").execute()
        queue = queue_response.data

        user_entry = next((item for item in queue if item["profile_id"] == profile_id), None)
        if not user_entry:
            return None

        profile = supabase.table("PROFILES").select("*").eq("id", profile_id).execute().data

        if not profile:
            raise ValueError("Perfil não encontrado.")

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

        position = next(
            (i for i, item in enumerate(ordered_queue) if item["profile_id"] == profile_id),
            None
        )

        if position is None:
            return None

        return position + 1

    
    def is_being_attended(self, profile_id: str):
        res = (
            supabase.table("QUEUE")
            .select("*")
            .eq("profile_id", profile_id)
            .eq("status", "being_attended")
            .execute()
        )

        data = res.data or []

        return len(data) > 0
    
    def advance_queue(self, doctor_id: str):
        attending_res = (
            self.table
            .select("*")
            .eq("assigned_doctor_id", doctor_id)
            .eq("status", "being_attended")
            .execute()
        )

        attending = attending_res.data or []

        if attending:
            return {
                "already_attending": True,
                "patient": attending[0]
            }

        queue_res = (
            self.table
            .select("*")
            .eq("status", "waiting")
            .execute()
        )

        queue = queue_res.data or []

        if not queue:
            return None

        priorities = []
        normals = []

        for item in queue:
            prof = (
                supabase.table("PROFILES")
                .select("priority")
                .eq("id", item["profile_id"])
                .execute()
            ).data or []

            is_priority = prof[0]["priority"] if prof else False

            if is_priority:
                priorities.append(item)
            else:
                normals.append(item)

        priorities.sort(key=lambda x: x["checkin"])
        normals.sort(key=lambda x: x["checkin"])

        ordered_queue = priorities + normals

        first = ordered_queue[0]

        supabase.table("QUEUE").update({
            "status": "being_attended",
            "assigned_doctor_id": doctor_id
        }).eq("id", first["id"]).execute()

        return {"already_attending": False, "patient": first}

        
queue_service = QueueService()