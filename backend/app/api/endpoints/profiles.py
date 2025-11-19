from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_user
from app.services.profile_service import profile_service

router = APIRouter(prefix="/profiles", tags=["Perfis"])

@router.get("/")
def get_all_profiles_endpoint():
    try:
        all_profiles = profile_service.get_all_profiles()
        return all_profiles
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )