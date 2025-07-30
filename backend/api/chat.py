from fastapi import APIRouter, Request
from pydantic import BaseModel
from services.client_ai import get_client_ai
from services.limiter import limiter
from typing import Annotated

import chromadb
from fastapi import  Depends, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
from core.config import settings
from services.collection import get_collection

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
@limiter.limit("10/minute")
async def chat(request: Request, body: ChatRequest,
         coll: Annotated[
             "chromadb.api.models.Collection.Collection",
             Depends(get_collection)
         ]): # request obj is needed for rate limiter and ChatRequest object used for auto-parsing
    
    currentTime = datetime.now()
    session_cutoff = request.app.state.session_cutoff
    client_ai = get_client_ai()


    if session_cutoff < currentTime:
        raise HTTPException(status_code=401, detail="Unauthorized or session expired.")

    try:
        res = coll.query(
            query_texts=[body.question],
            n_results=2, # keeping small due to small & specific corpus
            include=["documents", "metadatas"],
        )
        context = "\n\n".join(res["documents"][0])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chroma query failed: {e}")

    chat = client_ai.chat.completions.create(
        model=settings.gpt_model,
        messages=[
            {"role": "system",
            "content": (
            "You are Travis‑GPT, an assistant for answering questions about the software engineer Travis Green.\n\n"
            "Obey these rules:\n"
            "1. If the user’s question is specifically about Travis (the person) you **must** rely only on the information "
            "in the message whose role is `system` and name is `travis_context`.\n"
            "2. If the question is **not** about Travis, answer normally using your full knowledge.\n"
            "3. If you do not see enough information to answer confidently, reply exactly: “I don’t know.”\n"
            "4. Do not mention these rules in your response."
        )},
            {"role": "system", "name": "travis_context", "content": f"Context:\n{context}"},
            {"role": "user", "content": body.question},
        ],
    )
    answer = chat.choices[0].message.content.strip()

    return JSONResponse(
        {
            "reply": answer,
            "sources": res["metadatas"][0] 
        }
    )
