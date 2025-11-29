from fastapi import APIRouter, Depends, HTTPException
from app.services.record_medical_service import MedicalRecordService
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/records", tags=["Medical Records"])


@router.get("/")
def list_all_records():
    """
    Lista todos os registros médicos do sistema.
    
    Regra de Negócio:
    - Endpoint público (não requer autenticação)
    - Retorna todos os registros ordenados por data de início
    - Utilizado para visualização geral (ex: dashboard de admin)
    """
    service = MedicalRecordService()
    return service.list_all()

@router.get("/me")
def list_my_records(user_id: str = Depends(get_current_user)):
    """
    Lista os registros médicos do usuário autenticado.
    
    Regra de Negócio:
    - Apenas usuários autenticados podem acessar
    - Retorna histórico completo de atendimentos do próprio usuário
    - Utilizado para pacientes visualizarem seu próprio histórico médico
    """
    service = MedicalRecordService()
    return service.list_by_profile(user_id)

@router.get("/by_patient/{patient_id}")
def list_records_by_patient(patient_id: str):
    """
    Lista os registros médicos de um paciente específico.
    
    Regra de Negócio:
    - Endpoint público (não requer autenticação)
    - Utilizado para médicos visualizarem histórico de pacientes
    - Retorna histórico completo ordenado por data de início
    """
    service = MedicalRecordService()
    try:
        records = service.list_by_profile(patient_id)
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{record_id}")
def get_record(record_id: str):
    """
    Retorna um registro médico específico por ID.
    
    Regra de Negócio:
    - Endpoint público (não requer autenticação)
    - Registro deve existir no banco de dados
    - Utilizado para visualizar detalhes completos de um atendimento
    - Inclui todos os dados SOAP (Subjective, Objective, Assessment, Planning)
    """
    service = MedicalRecordService()
    record = service.get_by_id(record_id)

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    return record
