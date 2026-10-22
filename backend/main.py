import os
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from tavily import TavilyClient

from backend.services.history_service import history_service
from backend.services.video_generation_service import video_generation_service
from backend.agents.history_agent import history_agent
from backend.agents.cinematic_agent import cinematic_agent
from backend.agents.scene_agent import scene_agent


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

ASSETS_DIR = BASE_DIR / "Assets"
VIDEOS_DIR = ASSETS_DIR / "videos"
SCENES_DIR = VIDEOS_DIR / "scenes"
REAL_VIDEOS_DIR = VIDEOS_DIR / "real"
IMAGES_DIR = ASSETS_DIR / "images"
CSS_DIR = BASE_DIR / "css"
JS_DIR = BASE_DIR / "js"
INDEX_FILE = BASE_DIR / "index.html"


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Diwali History AI",
    description=(
        "A cinematic AI-powered journey through "
        "the stories, traditions and evolution of Diwali."
    ),
    version="2.0.0",
)


# ============================================================
# CORS
# ============================================================
# Allows the local Python frontend server and the deployed site
# to call this API from a browser.

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "https://diwali-history.netlify.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# STATIC FILES
# ============================================================

if VIDEOS_DIR.exists():
    app.mount(
        "/videos",
        StaticFiles(directory=str(VIDEOS_DIR)),
        name="videos",
    )

if IMAGES_DIR.exists():
    app.mount(
        "/images",
        StaticFiles(directory=str(IMAGES_DIR)),
        name="images",
    )

if ASSETS_DIR.exists():
    app.mount(
        "/Assets",
        StaticFiles(directory=str(ASSETS_DIR)),
        name="assets",
    )

if CSS_DIR.exists():
    app.mount(
        "/css",
        StaticFiles(directory=str(CSS_DIR)),
        name="css",
    )

if JS_DIR.exists():
    app.mount(
        "/js",
        StaticFiles(directory=str(JS_DIR)),
        name="js",
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    """Serve the main Diwali History frontend."""
    if not INDEX_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Frontend index.html not found.",
        )

    return FileResponse(str(INDEX_FILE), media_type="text/html")


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health_check() -> Dict[str, Any]:
    cinematic_video = SCENES_DIR / "diwali-rama-story-40sec.mp4"

    return {
        "status": "healthy",
        "backend": "running",
        "history_data": history_service.data_file.exists(),
        "videos_directory": VIDEOS_DIR.exists(),
        "scenes_directory": SCENES_DIR.exists(),
        "cinematic_video": cinematic_video.exists(),
    }


# ============================================================
# ASK DIWALI - WEB SEARCH
# ============================================================

class AskRequest(BaseModel):
    question: str = Field(min_length=2, max_length=600)


@app.get("/ask/health")
def ask_health() -> Dict[str, Any]:
    return {
        "service": "Diwali Ask AI",
        "configured": bool(os.getenv("TAVILY_API_KEY", "").strip()),
    }


@app.post("/ask")
def ask_diwali(payload: AskRequest) -> Dict[str, Any]:
    api_key = os.getenv("TAVILY_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Ask Diwali search is not configured.",
        )

    question = payload.question.strip()

    try:
        client = TavilyClient(api_key=api_key)
        data = client.search(
            question,
            search_depth="advanced",
            max_results=6,
            include_answer="advanced",
        )
    except Exception:
        # Avoid exposing API keys or provider internals to callers.
        raise HTTPException(
            status_code=502,
            detail="Web search failed. Please try again.",
        )

    sources = []
    for item in data.get("results", []):
        url = item.get("url")
        if not isinstance(url, str) or not url.startswith("https://"):
            continue

        sources.append(
            {
                "title": item.get("title") or url,
                "url": url,
                "snippet": item.get("content", ""),
            }
        )

    answer = data.get("answer") or ""
    if not answer and sources:
        answer = (
            "I found relevant web pages for your question, but no summary was "
            "returned. Please check the source links below."
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


# ============================================================
# HISTORY ENDPOINTS
# ============================================================

@app.get("/api/history")
def get_history() -> Dict[str, Any]:
    """Return all Diwali history chapters."""
    chapters = history_service.get_all_chapters()
    return {
        "status": "success",
        "count": len(chapters),
        "chapters": chapters,
    }


@app.get("/api/history/{chapter_id}")
def get_history_chapter(chapter_id: str) -> Dict[str, Any]:
    result = history_agent.get_chapter(chapter_id)
    if result.get("status") == "not_found":
        raise HTTPException(status_code=404, detail=result)
    return result


@app.get("/api/history/{chapter_id}/scenes")
def get_history_scenes(chapter_id: str) -> Dict[str, Any]:
    result = history_agent.get_scenes(chapter_id)
    if result.get("status") == "not_found":
        raise HTTPException(status_code=404, detail=result)
    return result


# ============================================================
# SEARCH
# ============================================================

@app.get("/api/search")
def search_history(q: str) -> Dict[str, Any]:
    if not q.strip():
        raise HTTPException(
            status_code=400,
            detail="Search keyword cannot be empty.",
        )
    return history_agent.search(q)


# ============================================================
# CINEMATIC ENDPOINTS
# ============================================================

@app.get("/api/cinematic/{chapter_id}")
def get_cinematic(chapter_id: str) -> Dict[str, Any]:
    result = cinematic_agent.get_chapter_cinematic(chapter_id)
    if result.get("status") == "not_found":
        raise HTTPException(status_code=404, detail=result)
    return result


@app.get("/api/agent/cinematic")
def cinematic_overview() -> Dict[str, Any]:
    """Return the complete cinematic journey."""
    return cinematic_agent.get_full_cinematic_journey()


@app.get("/api/agent/history")
def history_overview() -> Dict[str, Any]:
    """Return the structured history overview."""
    return history_agent.get_overview()


@app.get("/api/agent/video-plan/{chapter_id}")
def video_plan(chapter_id: str) -> Dict[str, Any]:
    result = cinematic_agent.create_video_plan(chapter_id)
    if result.get("status") == "not_found":
        raise HTTPException(status_code=404, detail=result)
    return result


@app.get("/api/agent/full-cinematic")
def full_cinematic() -> Dict[str, Any]:
    """Return the cinematic plan for the entire Diwali History journey."""
    return cinematic_agent.get_full_cinematic_journey()


# ============================================================
# SCENE ENDPOINTS
# ============================================================

@app.get("/api/scene/{chapter_id}/{scene_id}")
def get_scene(chapter_id: str, scene_id: str) -> Dict[str, Any]:
    result = scene_agent.get_scene(chapter_id, scene_id)
    if result.get("status") == "not_found":
        raise HTTPException(status_code=404, detail=result)
    return result


@app.get("/api/scenes/{chapter_id}")
def get_all_scenes(chapter_id: str) -> Dict[str, Any]:
    result = scene_agent.get_all_scenes(chapter_id)
    if result.get("status") == "not_found":
        raise HTTPException(status_code=404, detail=result)
    return result


@app.get("/api/scene-status/{chapter_id}/{scene_id}")
def get_scene_status(chapter_id: str, scene_id: str) -> Dict[str, Any]:
    result = scene_agent.get_scene_status(chapter_id, scene_id)
    if result.get("status") == "not_found":
        raise HTTPException(status_code=404, detail=result)
    return result


@app.get("/api/scene-plan/{chapter_id}")
def get_scene_plan(chapter_id: str) -> Dict[str, Any]:
    result = scene_agent.create_scene_plan(chapter_id)
    if result.get("status") == "not_found":
        raise HTTPException(status_code=404, detail=result)
    return result


# ============================================================
# VIDEO ENDPOINTS
# ============================================================

@app.get("/api/video/{chapter_id}/{scene_id}")
def get_scene_video(chapter_id: str, scene_id: str) -> Dict[str, Any]:
    return video_generation_service.get_scene_video(chapter_id, scene_id)


@app.get("/api/video/{chapter_id}")
def get_chapter_cinematic_video(chapter_id: str) -> Dict[str, Any]:
    chapter = history_service.get_chapter(chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found.")

    cinematic = chapter.get("cinematic", {})
    video_path = cinematic.get("video")

    if not video_path:
        return {
            "status": "not_found",
            "chapter_id": chapter_id,
            "video": None,
        }

    return video_generation_service.get_cinematic_video(video_path)


# ============================================================
# AVAILABLE VIDEOS
# ============================================================

@app.get("/api/videos")
def get_available_videos() -> Dict[str, Any]:
    return video_generation_service.get_available_videos()


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
def startup_event():
    print()
    print("=" * 60)
    print("🎆 DIWALI HISTORY AI")
    print("=" * 60)
    print(f"📁 Project: {BASE_DIR}")
    print(f"📚 History file: {history_service.data_file}")
    print(f"🎬 Videos: {VIDEOS_DIR}")
    print(f"🎞️ Scenes: {SCENES_DIR}")
    print(f"📸 Images: {IMAGES_DIR}")
    print(f"📖 Chapters: {history_service.get_chapter_count()}")

    cinematic_video = SCENES_DIR / "diwali-rama-story-40sec.mp4"
    if cinematic_video.exists():
        print("✅ Main cinematic video found:")
        print(f"   {cinematic_video.name}")
    else:
        print("⚠️ Main cinematic video not found.")

    print("=" * 60)
    print("🚀 Backend ready")
    print("=" * 60)
    print()


# ============================================================
# SHUTDOWN
# ============================================================

@app.on_event("shutdown")
def shutdown_event():
    print()
    print("🛑 Diwali History backend stopped.")
