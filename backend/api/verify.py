from fastapi import APIRouter, Request
from pydantic import BaseModel
from core.config import settings
from services.limiter import limiter

from fastapi import HTTPException, Request
from datetime import datetime, timedelta

router = APIRouter()
access_duration = timedelta(minutes=2)
retry_delay = timedelta(seconds=60)

class VerifyRequest(BaseModel):
    code: str

@router.post("/verify")
@limiter.limit("5/minute") 
async def verify(request: Request, body: VerifyRequest):

    access_code = settings.access_code

    if body.code == access_code:
        now = datetime.now()
        request.app.state.session_cutoff = now + access_duration
        return request.app.state.session_cutoff
    else:
        raise HTTPException(status_code=403, detail="Invalid code")