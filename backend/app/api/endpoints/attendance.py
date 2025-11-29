from fastapi import APIRouter, HTTPException, Depends, status
from app.services.attendance_service import attendance_service
from app.core.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/attendance", tags=["Atendimento"])

class FinishAttendanceSchema(BaseModel):
    """
    Schema para finalização de atendimento usando metodologia SOAP.
    
    Metodologia SOAP:
    - subjective: Dados subjetivos (queixas, histórico relatado pelo paciente)
    - objective_data: Dados objetivos (sinais vitais, exames, observações clínicas)
    - assessment: Avaliação e diagnóstico
    - planning: Plano de tratamento e recomendações
    """
    subjective: str
    objective_data: str
    assessment: str
    planning: str

@router.get("/current")
def get_current_attendance(user_id: str = Depends(get_current_user)):
    """
    Retorna o atendimento ativo do médico autenticado.
    
    Regra de Negócio:
    - Apenas médicos podem acessar este endpoint
    - Retorna o paciente que está sendo atendido no momento
    - Um médico pode ter apenas um atendimento ativo por vez
    """
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
    """
    Finaliza um atendimento e cria o registro médico permanente.
    
    Regras de Negócio (CRÍTICAS):
    1. Apenas médicos podem finalizar atendimentos
    2. Deve existir um atendimento ativo para o médico
    3. Utiliza metodologia SOAP para registro
    4. Cria registro médico permanente no banco
    5. Remove paciente da fila após finalizar
    
    Processo:
    1. Valida se há atendimento ativo
    2. Cria registro médico com dados SOAP
    3. Remove paciente da fila
    4. Retorna registro criado
    
    Args:
        data: Dados do atendimento em formato SOAP
        user_id: ID do médico (extraído do token JWT)
    """
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
        # Erro de validação de negócio (ex: nenhum atendimento ativo)
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:
        # Erro interno do servidor
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
