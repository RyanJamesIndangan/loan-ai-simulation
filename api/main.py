from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api.models import init_db
from api.routes import loan_router, training_router

# Create FastAPI app
app = FastAPI(
    title="AI Loan Decisioning System",
    description="AI-powered loan application and decisioning system with fraud detection",
    version="1.0.0",
    docs_url="/",  # Swagger UI at root
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(loan_router)
app.include_router(training_router)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    print("🚀 Starting AI Loan Decisioning System...")
    print("📊 Initializing database...")
    init_db()
    print("✅ Database initialized")
    print("🤖 Loading ML model...")
    # Model is loaded in AIService __init__
    print("✅ System ready!")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Loan Decisioning System",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

