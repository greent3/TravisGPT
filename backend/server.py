from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI
from collection.db import boot_up_collection
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from api import chat, verify, status
from services.limiter import limiter
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from fastapi import Request
from core.config import settings  

load_dotenv(dotenv_path=".env", override=True)

collection = boot_up_collection()

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.session_cutoff = datetime.now()
    yield


app = FastAPI(title="Travis Resume RAG Bot", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.state.collection = collection

app.include_router(chat.router)
app.include_router(verify.router)
app.include_router(status.router)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})







