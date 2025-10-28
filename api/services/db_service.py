from sqlalchemy.orm import Session
from typing import Optional, List
from api.models import User, Loan

class DatabaseService:
    """Service for database operations"""
    
    @staticmethod
    def create_user(db: Session, name: str, email: str) -> User:
        """Create a new user"""
        user = User(name=name, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_or_create_user(db: Session, name: str, email: str) -> User:
        """Get existing user or create new one"""
        user = DatabaseService.get_user_by_email(db, email)
        if user is None:
            user = DatabaseService.create_user(db, name, email)
        return user
    
    @staticmethod
    def create_loan(db: Session, user_id: int, income: float, credit_score: int,
                   age: int, loan_amount: float, approval_status: str,
                   risk_score: float, fraud_score: float) -> Loan:
        """Create a new loan application"""
        loan = Loan(
            user_id=user_id,
            income=income,
            credit_score=credit_score,
            age=age,
            loan_amount=loan_amount,
            approval_status=approval_status,
            risk_score=risk_score,
            fraud_score=fraud_score
        )
        db.add(loan)
        db.commit()
        db.refresh(loan)
        return loan
    
    @staticmethod
    def get_loan_by_id(db: Session, loan_id: int) -> Optional[Loan]:
        """Get loan by ID"""
        return db.query(Loan).filter(Loan.id == loan_id).first()
    
    @staticmethod
    def get_all_loans(db: Session, skip: int = 0, limit: int = 100) -> List[Loan]:
        """Get all loans with pagination"""
        return db.query(Loan).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_loans_by_user(db: Session, user_id: int) -> List[Loan]:
        """Get all loans for a specific user"""
        return db.query(Loan).filter(Loan.user_id == user_id).all()
    
    @staticmethod
    def update_loan_repayment(db: Session, loan_id: int, repayment_amount: float,
                             new_risk_score: float) -> Optional[Loan]:
        """Update loan repayment status"""
        loan = DatabaseService.get_loan_by_id(db, loan_id)
        if loan is None:
            return None
        
        loan.repayment_amount = repayment_amount
        loan.risk_score = new_risk_score
        
        # Update repayment status
        if repayment_amount >= loan.loan_amount:
            loan.repayment_status = "completed"
        elif repayment_amount > 0:
            loan.repayment_status = "in_progress"
        else:
            loan.repayment_status = "not_started"
        
        db.commit()
        db.refresh(loan)
        return loan
    
    @staticmethod
    def get_loan_statistics(db: Session) -> dict:
        """Get overall loan statistics"""
        total_loans = db.query(Loan).count()
        approved_loans = db.query(Loan).filter(Loan.approval_status == "approved").count()
        rejected_loans = db.query(Loan).filter(Loan.approval_status == "rejected").count()
        
        return {
            "total_loans": total_loans,
            "approved_loans": approved_loans,
            "rejected_loans": rejected_loans,
            "approval_rate": approved_loans / total_loans if total_loans > 0 else 0
        }

