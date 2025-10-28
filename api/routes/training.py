from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

from api.services import ai_service

router = APIRouter(prefix="/api", tags=["training"])

class RetrainingResponse(BaseModel):
    message: str
    accuracy: float
    status: str

@router.post("/retrain-model", response_model=RetrainingResponse)
async def retrain_model():
    """
    Retrain the ML model using the latest data
    
    This is a mock endpoint that triggers model retraining.
    In production, this would:
    1. Fetch latest loan data from database
    2. Retrain model with new data
    3. Validate model performance
    4. Deploy new model if performance improves
    """
    try:
        # Import train_model function
        from ml.train_model import train_model
        
        # Trigger retraining
        print("🔄 Starting model retraining...")
        model, scaler, accuracy = train_model()
        
        # Reload model in AI service
        ai_service.load_model()
        
        return RetrainingResponse(
            message="Model retrained successfully",
            accuracy=accuracy,
            status="success"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error during model retraining: {str(e)}"
        )

@router.get("/model-info")
async def get_model_info():
    """
    Get information about the current ML model
    """
    if ai_service.model is None:
        return {
            "status": "not_loaded",
            "message": "Model not loaded. Please train the model first.",
            "model_type": None
        }
    
    return {
        "status": "loaded",
        "message": "Model is loaded and ready",
        "model_type": type(ai_service.model).__name__,
        "features": ["income", "credit_score", "age", "loan_amount"]
    }

