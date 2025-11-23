
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
        response = (
            self.table
            .delete()
            .eq("profile_id", profile_id)
            .eq("status", "waiting")
            .execute()
        )
        return response.data
    
    def get_position(self, profile_id: str):
        # Busca a entrada específica
        entry_res = (
            self.table
            .select("*")
            .eq("profile_id", profile_id)
            .single()
            .execute()
        )

        entry = entry_res.data
        if not entry:
            return None

        if entry["status"] == "assigned":
            return "assigned"  # já chamado pelo médico

        # status == waiting → calcular posição
        queue_res = self.table.select("*").eq("status", "waiting").execute()
        queue = queue_res.data

        # separar prioridade
        priorities = []
        normals = []

        for item in queue:
            # buscar se é prioridade
            p = supabase.table("PROFILES")\
                        .select("priority")\
                        .eq("id", item["profile_id"])\
                        .execute().data
            is_priority = p[0]["priority"] if p else False

            if is_priority:
                priorities.append(item)
            else:
                normals.append(item)

        priorities.sort(key=lambda x: x["checkin"])
        normals.sort(key=lambda x: x["checkin"])

        ordered = priorities + normals

        for index, item in enumerate(ordered):
            if item["profile_id"] == profile_id:
                return index + 1

        return None

    
    def is_being_attended(self, profile_id: str):
        response = (
            supabase.table("CURRENT_ATTENDANCE")
            .select("*")
            .eq("patient_id", profile_id)
            .execute()
        )

        return len(response) > 0
    
    def advance_queue(self, doctor_id: str):
        queue_res = self.table.select("*").eq("status", "waiting").execute()
        queue = queue_res.data
        if not queue:
            return None

        priorities = []
        normals = []

        for item in queue:
            p = supabase.table("PROFILES")\
                        .select("priority")\
                        .eq("id", item["profile_id"])\
                        .execute().data
            is_priority = p[0]["priority"] if p else False

            if is_priority:
                priorities.append(item)
            else:
                normals.append(item)

        priorities.sort(key=lambda x: x["checkin"])
        normals.sort(key=lambda x: x["checkin"])

        ordered = priorities + normals

        first = ordered[0]

        update_res = (
            self.table
            .update({
                "status": "assigned",
                "assigned_doctor_id": doctor_id
            })
            .eq("id", first["id"])
            .eq("status", "waiting")
            .execute()
        )

        if not update_res.data:
            return self.advance_queue(doctor_id)

        now = datetime.now(ZoneInfo("America/Fortaleza")).isoformat()

        supabase.table("CURRENT_ATTENDANCE").insert({
            "doctor_id": doctor_id,
            "patient_id": first["profile_id"],
            "started_at": now
        }).execute()

        return first
        
        
queue_service = QueueService()