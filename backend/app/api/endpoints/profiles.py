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
    
@router.get("/me")
def get_my_profile(user_id: str = Depends(get_current_user)):
    try:
        profile = profile_service.get_profile(user_id)

        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found"
            )

        return profile

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.get("/{profile_id}")
def get_profile_by_id(profile_id: str):
    try:
        profile = profile_service.get_profile(profile_id)

        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        return profile

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))