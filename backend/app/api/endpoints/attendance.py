from fastapi import APIRouter, HTTPException, Depends, status
from app.services.attendance_service import attendance_service
from app.core.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/attendance", tags=["Atendimento"])

class FinishAttendanceSchema(BaseModel):
    subjective: str
    objective_data: str
    assessment: str
    planning: str

@router.get("/current")
def get_current_attendance(user_id: str = Depends(get_current_user)):
    try:
        current = attendance_service.get_current_attendance(user_id)

        if not current:
            raise HTTPException(
                status_code=404,
                detail="Nenhum atendimento ativo no momento."
            )

        return current

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/finish")
def finish_attendance(
    data: FinishAttendanceSchema,
    user_id: str = Depends(get_current_user)
):
    try:
        finished = attendance_service.finish_attendance(
            doctor_id=user_id,
            subjective=data.subjective,
            objective_data=data.objective_data,
            assessment=data.assessment,
            planning=data.planning
        )

        return {
            "message": "Atendimento finalizado com sucesso.",
            "record": finished
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
