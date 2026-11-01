"""
bookmark_manager — Backend API
Built on AINative Platform. Uses ZeroDB for storage, AINative JWT for auth.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routers.authentication import router as authentication_router
from app.routers.bookmark_management import router as bookmark_management_router
from app.routers.tag_system import router as tag_system_router
from app.routers.dashboard import router as dashboard_router
from app.routers.filter_by_tag import router as filter_by_tag_router

app = FastAPI(
    title="bookmark_manager API",
    version="0.1.0",
    description="Backend API for bookmark_manager, powered by AINative platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.ainative.studio"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication_router, prefix='/api/v1')
app.include_router(bookmark_management_router, prefix='/api/v1')
app.include_router(tag_system_router, prefix='/api/v1')
app.include_router(dashboard_router, prefix='/api/v1')
app.include_router(filter_by_tag_router, prefix='/api/v1')

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "bookmark_manager"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
