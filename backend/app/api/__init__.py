from fastapi import APIRouter
from .endpoints import auth 
from .endpoints import profiles
from .endpoints import queue


api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profiles.router)
api_router.include_router(queue.router)