from datetime import datetime
from zoneinfo import ZoneInfo
from app.core.config import supabase


class AttendanceService:
    def __init__(self):
        self.current = supabase.table("CURRENT_ATTENDANCE")
        self.records = supabase.table("RECORD_MEDICAL")

    def get_current_attendance(self, doctor_id: str):
        response = (
            self.current
            .select("*")
            .eq("doctor_id", doctor_id)
            .execute()
        )

        return response.data[0] if response.data else None

    def start_attendance(self, doctor_id: str, patient_id: str):
        now_fortaleza = datetime.now(ZoneInfo("America/Fortaleza")).isoformat()

        insert_data = {
            "doctor_id": doctor_id,
            "patient_id": patient_id,
            "started_at": now_fortaleza
        }

        response = self.current.insert(insert_data).execute()

        return response.data[0]

    def finish_attendance(
        self,
        doctor_id: str,
        subjective: str,
        objective_data: str,
        assessment: str,
        planning: str
    ):
        current = self.get_current_attendance(doctor_id)

        if not current:
            raise ValueError("Nenhum atendimento ativo encontrado.")

        now_fortaleza = datetime.now(ZoneInfo("America/Fortaleza")).isoformat()

        record_data = {
            "doctor_id": current["doctor_id"],
            "patient_id": current["patient_id"],
            "started_at": current["started_at"],
            "end_at": now_fortaleza,
            "subjective": subjective,
            "objective_data": objective_data,
            "assessment": assessment,
            "planning": planning,
        }

        create_record = self.records.insert(record_data).execute()

        self.current.delete().eq("doctor_id", doctor_id).execute()

        return create_record.data[0]


attendance_service = AttendanceService()
