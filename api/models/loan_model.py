from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    income = Column(Float, nullable=False)
    credit_score = Column(Integer, nullable=False)
    loan_amount = Column(Float, nullable=False)
    age = Column(Integer, nullable=False)
    approval_status = Column(String, nullable=False, default="pending")  # pending, approved, rejected
    risk_score = Column(Float, nullable=True)
    repayment_status = Column(String, default="not_started")  # not_started, in_progress, completed, defaulted
    repayment_amount = Column(Float, default=0.0)
    fraud_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", backref="loans")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "income": self.income,
            "credit_score": self.credit_score,
            "loan_amount": self.loan_amount,
            "age": self.age,
            "approval_status": self.approval_status,
            "risk_score": self.risk_score,
            "repayment_status": self.repayment_status,
            "repayment_amount": self.repayment_amount,
            "fraud_score": self.fraud_score,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

