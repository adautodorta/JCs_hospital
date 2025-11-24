from fastapi import APIRouter, HTTPException, status, Depends
from app.services.queue_service import queue_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/queue", tags=["Fila"])

@router.get("/")
def get_queue_endpoint():
    try:
        queue = queue_service.get_queue()
        return queue
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
@router.post("/checkin")
def checkin_in_queue(user_id: str = Depends(get_current_user)):
    try:
        result = queue_service.checkin_queue(user_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
@router.delete("/checkin")
def cancel_checkin(user_id: str = Depends(get_current_user)):
    try:
        result = queue_service.cancel_checkin(user_id)

        if not result:
            raise HTTPException(status_code=404, detail="Nenhum check-in encontrado para este usuário.")

        return {"message": "Check-in cancelado com sucesso."}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.get("/position")
def get_my_position(user_id: str = Depends(get_current_user)):
    try:
        position = queue_service.get_position(user_id)

        if position is not None:
            return {"status": "waiting", "position": position}

        if queue_service.is_being_attended(user_id):
            return {"status": "called"}

        return {"status": "not_in_queue"}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.post("/next")
def call_next(doctor_id: str = Depends(get_current_user)):
    try:
        result = queue_service.advance_queue(doctor_id)

        if not result:
            return {"message": "A fila está vazia."}

        if result.get("already_attending"):
            return {
                "message": "Você já possui um paciente em atendimento.",
                "called": result["patient"]
            }

        return {
            "message": "Próximo paciente chamado.",
            "called": result["patient"]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )