from fastapi import APIRouter, Request
from fastapi import  Request
from datetime import datetime
from services.limiter import limiter


router = APIRouter()

@router.get("/status")
@limiter.limit("60/minute") 
async def status(request: Request):
    session_cutoff = request.app.state.session_cutoff
    if session_cutoff and session_cutoff > datetime.now():
        return {"valid": True}
    return {"valid": False}