
import os

from tavily import TavilyClient
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "").strip()

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ASK_DIWALI_ALLOWED_ORIGINS",
        "http://localhost:5500,"
        "http://127.0.0.1:5500,"
        "https://diwali-history.netlify.app",
    ).split(",")
    if origin.strip()
]

app = FastAPI(title="Diwali Ask AI", version="1.4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class AskRequest(BaseModel):
    question: str = Field(min_length=2, max_length=600)


@app.get("/")
async def home():
    return {
        "service": "Diwali Ask AI",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {
        "ok": True,
        "configured": bool(TAVILY_API_KEY),
    }


@app.post("/ask")
async def ask(payload: AskRequest):
    if not TAVILY_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="TAVILY_API_KEY is not configured.",
        )

    question = payload.question.strip()

    try:
        client = TavilyClient(api_key=TAVILY_API_KEY)
        data = client.search(
            question,
            search_depth="advanced",
            max_results=6,
            include_answer="advanced",
        )
    except Exception:
        # Do not expose API keys or provider internals in error messages.
        except Exception:
    import logging
    logging.exception("Tavily search failed")
    raise HTTPException(
        status_code=502,
        detail="Web search failed. Check the VS Code terminal."
    )
    sources = []

    for item in data.get("results", []):
        url = item.get("url")

        if not isinstance(url, str) or not url.startswith("https://"):
            continue

        sources.append({
            "title": item.get("title") or url,
            "url": url,
            "snippet": item.get("content", ""),
        })

    answer = data.get("answer") or ""

    if not answer and sources:
        answer = (
            "I found relevant web pages for your question, "
            "but the search service did not provide a summary. "
            "Please check the source links below."
        )

    if not answer and not sources:
        raise HTTPException(
            status_code=502,
            detail="No useful results were returned. Try rephrasing your question.",
        )

    return {
        "answer": answer,
        "sources": sources,
        "note": (
            "AI-generated summaries may contain errors. "
            "Check the original sources for important details."
        ),
    }
