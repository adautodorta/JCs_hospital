from fastapi import APIRouter, HTTPException, status, Depends
from app.services.queue_service import queue_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/queue", tags=["Fila"])

@router.get("/")
def get_queue_endpoint():
    """
    Retorna toda a fila de atendimento.
    Endpoint público (não requer autenticação) para visualização geral.
    """
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
    """
    Realiza check-in do paciente autenticado na fila.
    
    Regra de Negócio:
    - Apenas pacientes autenticados podem fazer check-in
    - Cada paciente pode ter apenas um check-in ativo por vez
    - Check-in registra automaticamente data/hora no timezone de Fortaleza
    """
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
    """
    Cancela o check-in do paciente autenticado.
    
    Regra de Negócio:
    - Apenas o próprio paciente pode cancelar seu check-in
    - Não permite cancelamento se já estiver em atendimento
    - Remove completamente a entrada da fila
    """
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
    """
    Retorna a posição atual do paciente na fila.
    
    Regra de Negócio:
    - Posição considera priorização (pacientes prioritários primeiro)
    - Dentro de cada grupo, ordenação é por horário de check-in
    - Retorna status: "waiting" (com posição), "called" (sendo atendido), "not_in_queue"
    """
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
    """
    Chama o próximo paciente da fila para atendimento.
    
    Regras de Negócio (CRÍTICAS):
    1. Apenas médicos podem chamar pacientes
    2. Um médico pode atender apenas um paciente por vez
    3. Se médico já está atendendo, retorna o paciente atual
    4. Priorização: pacientes com priority=True são chamados primeiro
    5. Dentro de cada grupo, ordem é por horário de check-in
    
    Returns:
        - {"message": "A fila está vazia."} se não houver pacientes
        - {"message": "Você já possui...", "called": ...} se já está atendendo
        - {"message": "Próximo paciente chamado.", "called": ...} se chamou novo paciente
    """
    try:
        result = queue_service.advance_queue(doctor_id)

        if not result:
            return {"message": "A fila está vazia."}

        # Regra: Médico não pode atender múltiplos pacientes simultaneamente
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