from fastapi import APIRouter
from .endpoints import auth 
from .endpoints import profiles
from .endpoints import queue
from .endpoints import attendance
from .endpoints import record_medical


api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profiles.router)
api_router.include_router(queue.router)
api_router.include_router(attendance.router)
api_router.include_router(record_medical.router)