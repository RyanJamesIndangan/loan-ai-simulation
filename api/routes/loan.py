from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from api.models import get_db
from api.services import ai_service, DatabaseService

router = APIRouter(prefix="/api", tags=["loans"])

# Pydantic models for request/response validation
class LoanApplication(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(..., ge=18, le=100)
    income: float = Field(..., gt=0)
    credit_score: int = Field(..., ge=300, le=850)
    loan_amount: float = Field(..., gt=0)

class LoanResponse(BaseModel):
    loan_id: int
    user_id: int
    applicant_name: str
    applicant_email: str
    income: float
    credit_score: int
    age: int
    loan_amount: float
    approval_status: str
    risk_score: float
    fraud_score: float
    fraud_level: str
    approval_probability: float
    repayment_status: str
    repayment_amount: float

class RepaymentRequest(BaseModel):
    amount: float = Field(..., gt=0)

class StatisticsResponse(BaseModel):
    total_loans: int
    approved_loans: int
    rejected_loans: int
    approval_rate: float

@router.post("/apply-loan", response_model=LoanResponse)
async def apply_loan(application: LoanApplication, db: Session = Depends(get_db)):
    """
    Submit a loan application
    
    This endpoint:
    1. Creates or retrieves user
    2. Runs AI model to predict approval
    3. Runs fraud detection
    4. Saves loan to database
    """
    try:
        # Get or create user
        user = DatabaseService.get_or_create_user(
            db, 
            name=application.name, 
            email=application.email
        )
        
        # Get AI prediction
        prediction = ai_service.predict_loan_approval(
            income=application.income,
            credit_score=application.credit_score,
            age=application.age,
            loan_amount=application.loan_amount
        )
        
        # Run fraud detection
        fraud_result = ai_service.detect_fraud(
            income=application.income,
            credit_score=application.credit_score,
            age=application.age,
            loan_amount=application.loan_amount
        )
        
        # Override approval if fraud detected
        approval_status = prediction["approval_status"]
        if fraud_result["is_fraudulent"]:
            approval_status = "rejected"
        
        # Create loan record
        loan = DatabaseService.create_loan(
            db=db,
            user_id=user.id,
            income=application.income,
            credit_score=application.credit_score,
            age=application.age,
            loan_amount=application.loan_amount,
            approval_status=approval_status,
            risk_score=prediction["risk_score"],
            fraud_score=fraud_result["fraud_score"]
        )
        
        return LoanResponse(
            loan_id=loan.id,
            user_id=user.id,
            applicant_name=user.name,
            applicant_email=user.email,
            income=loan.income,
            credit_score=loan.credit_score,
            age=loan.age,
            loan_amount=loan.loan_amount,
            approval_status=loan.approval_status,
            risk_score=loan.risk_score,
            fraud_score=loan.fraud_score,
            fraud_level=fraud_result["fraud_level"],
            approval_probability=prediction["approval_probability"],
            repayment_status=loan.repayment_status,
            repayment_amount=loan.repayment_amount
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing loan application: {str(e)}")

@router.get("/loans", response_model=List[LoanResponse])
async def get_loans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all loan applications with pagination
    """
    try:
        loans = DatabaseService.get_all_loans(db, skip=skip, limit=limit)
        
        response = []
        for loan in loans:
            response.append(LoanResponse(
                loan_id=loan.id,
                user_id=loan.user_id,
                applicant_name=loan.user.name,
                applicant_email=loan.user.email,
                income=loan.income,
                credit_score=loan.credit_score,
                age=loan.age,
                loan_amount=loan.loan_amount,
                approval_status=loan.approval_status,
                risk_score=loan.risk_score,
                fraud_score=loan.fraud_score,
                fraud_level=ai_service._get_fraud_level(loan.fraud_score),
                approval_probability=1 - loan.risk_score,  # Approximate
                repayment_status=loan.repayment_status,
                repayment_amount=loan.repayment_amount
            ))
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving loans: {str(e)}")

@router.get("/loans/{loan_id}", response_model=LoanResponse)
async def get_loan(loan_id: int, db: Session = Depends(get_db)):
    """
    Get a specific loan by ID
    """
    loan = DatabaseService.get_loan_by_id(db, loan_id)
    
    if loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    return LoanResponse(
        loan_id=loan.id,
        user_id=loan.user_id,
        applicant_name=loan.user.name,
        applicant_email=loan.user.email,
        income=loan.income,
        credit_score=loan.credit_score,
        age=loan.age,
        loan_amount=loan.loan_amount,
        approval_status=loan.approval_status,
        risk_score=loan.risk_score,
        fraud_score=loan.fraud_score,
        fraud_level=ai_service._get_fraud_level(loan.fraud_score),
        approval_probability=1 - loan.risk_score,
        repayment_status=loan.repayment_status,
        repayment_amount=loan.repayment_amount
    )

@router.post("/repay-loan/{loan_id}", response_model=LoanResponse)
async def repay_loan(loan_id: int, repayment: RepaymentRequest, db: Session = Depends(get_db)):
    """
    Update loan repayment progress
    
    This endpoint:
    1. Updates repayment amount
    2. Recalculates risk score based on repayment history
    3. Updates repayment status
    """
    loan = DatabaseService.get_loan_by_id(db, loan_id)
    
    if loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    if loan.approval_status != "approved":
        raise HTTPException(status_code=400, detail="Cannot make repayment on non-approved loan")
    
    # Calculate new repayment amount
    new_repayment_amount = loan.repayment_amount + repayment.amount
    
    # Prevent overpayment
    if new_repayment_amount > loan.loan_amount:
        new_repayment_amount = loan.loan_amount
    
    # Recalculate risk score
    new_risk_score = ai_service.calculate_repayment_risk(
        loan_amount=loan.loan_amount,
        repayment_amount=new_repayment_amount,
        original_risk_score=loan.risk_score
    )
    
    # Update loan
    updated_loan = DatabaseService.update_loan_repayment(
        db=db,
        loan_id=loan_id,
        repayment_amount=new_repayment_amount,
        new_risk_score=new_risk_score
    )
    
    return LoanResponse(
        loan_id=updated_loan.id,
        user_id=updated_loan.user_id,
        applicant_name=updated_loan.user.name,
        applicant_email=updated_loan.user.email,
        income=updated_loan.income,
        credit_score=updated_loan.credit_score,
        age=updated_loan.age,
        loan_amount=updated_loan.loan_amount,
        approval_status=updated_loan.approval_status,
        risk_score=updated_loan.risk_score,
        fraud_score=updated_loan.fraud_score,
        fraud_level=ai_service._get_fraud_level(updated_loan.fraud_score),
        approval_probability=1 - updated_loan.risk_score,
        repayment_status=updated_loan.repayment_status,
        repayment_amount=updated_loan.repayment_amount
    )

@router.get("/statistics", response_model=StatisticsResponse)
async def get_statistics(db: Session = Depends(get_db)):
    """
    Get overall loan statistics
    """
    stats = DatabaseService.get_loan_statistics(db)
    return StatisticsResponse(**stats)

