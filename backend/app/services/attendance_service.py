from datetime import datetime
from zoneinfo import ZoneInfo
from app.core.config import supabase


class AttendanceService:
    def __init__(self):
        self.records = supabase.table("RECORD_MEDICAL")
        self.queue = supabase.table("QUEUE")

    def get_current_attendance(self, doctor_id: str):
        response = (
            self.queue
            .select("*")
            .eq("assigned_doctor_id", doctor_id)
            .in_("status", ["being_attended"])
            .execute()
        )

        entry = response.data[0] if response.data else None

        if entry:
            self.queue.update({"status": "being_attended"}) \
                .eq("id", entry["id"]) \
                .execute()

        return entry

    def finish_attendance(
        self,
        doctor_id: str,
        subjective: str,
        objective_data: str,
        assessment: str,
        planning: str
    ):
        response = (
            self.queue
            .select("*")
            .eq("assigned_doctor_id", doctor_id)
            .eq("status", "being_attended")
            .execute()
        )

        current = response.data[0] if response.data else None

        if not current:
            raise ValueError("Nenhum atendimento ativo encontrado.")

        now = datetime.now(ZoneInfo("America/Fortaleza")).isoformat()

        record_data = {
            "doctor_id": doctor_id,
            "patient_id": current["profile_id"],
            "started_at": current["checkin"],
            "end_at": now,
            "subjective": subjective,
            "objective_data": objective_data,
            "assessment": assessment,
            "planning": planning,
        }

        record = self.records.insert(record_data).execute().data[0]

        self.queue.delete().eq("id", current["id"]).execute()

        return record


attendance_service = AttendanceService()
