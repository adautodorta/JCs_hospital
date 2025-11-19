from fastapi import APIRouter, Depends, HTTPException
from app.services.record_medical_service import MedicalRecordService
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/records", tags=["Medical Records"])


@router.get("/")
def list_all_records():
    service = MedicalRecordService()
    return service.list_all()


@router.get("/me")
def list_my_records(user_id: str = Depends(get_current_user)):
    service = MedicalRecordService()
    return service.list_by_profile(user_id)


@router.get("/{record_id}")
def get_record(record_id: str):
    service = MedicalRecordService()
    record = service.get_by_id(record_id)

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    return record
