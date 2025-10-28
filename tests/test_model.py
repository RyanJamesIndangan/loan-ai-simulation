import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api.services import ai_service

def test_loan_approval_prediction():
    """Test loan approval prediction"""
    # Good candidate
    result = ai_service.predict_loan_approval(
        income=75000,
        credit_score=750,
        age=35,
        loan_amount=20000
    )
    
    assert "approval_probability" in result
    assert "risk_score" in result
    assert "approval_status" in result
    assert result["approval_status"] in ["approved", "rejected"]
    assert 0 <= result["approval_probability"] <= 1
    assert 0 <= result["risk_score"] <= 1

def test_high_approval_probability():
    """Test high-quality applicant gets approved"""
    result = ai_service.predict_loan_approval(
        income=90000,
        credit_score=800,
        age=40,
        loan_amount=15000
    )
    
    assert result["approval_status"] == "approved"
    assert result["approval_probability"] > 0.5

def test_low_approval_probability():
    """Test low-quality applicant gets rejected"""
    result = ai_service.predict_loan_approval(
        income=20000,
        credit_score=520,
        age=21,
        loan_amount=30000
    )
    
    assert result["approval_status"] == "rejected"
    assert result["approval_probability"] < 0.5

def test_fraud_detection_clean():
    """Test fraud detection with clean application"""
    result = ai_service.detect_fraud(
        income=60000,
        credit_score=700,
        age=30,
        loan_amount=12000
    )
    
    assert "fraud_score" in result
    assert "is_fraudulent" in result
    assert "fraud_level" in result
    assert not result["is_fraudulent"]
    assert result["fraud_level"] == "low"

def test_fraud_detection_suspicious():
    """Test fraud detection with suspicious application"""
    result = ai_service.detect_fraud(
        income=30000,
        credit_score=550,
        age=22,
        loan_amount=80000  # Very high loan amount
    )
    
    assert result["fraud_score"] > 0.3
    assert result["fraud_level"] in ["medium", "high"]

def test_fraud_detection_high_income_young_age():
    """Test fraud detection for unusually high income at young age"""
    result = ai_service.detect_fraud(
        income=150000,  # Very high for age
        credit_score=700,
        age=23,
        loan_amount=20000
    )
    
    assert result["fraud_score"] > 0.1

def test_repayment_risk_calculation():
    """Test repayment risk calculation"""
    original_risk = 0.4
    
    # No repayment
    risk_no_payment = ai_service.calculate_repayment_risk(
        loan_amount=10000,
        repayment_amount=0,
        original_risk_score=original_risk
    )
    assert risk_no_payment == original_risk
    
    # 50% repayment
    risk_half_payment = ai_service.calculate_repayment_risk(
        loan_amount=10000,
        repayment_amount=5000,
        original_risk_score=original_risk
    )
    assert risk_half_payment < original_risk
    
    # Full repayment
    risk_full_payment = ai_service.calculate_repayment_risk(
        loan_amount=10000,
        repayment_amount=10000,
        original_risk_score=original_risk
    )
    assert risk_full_payment < risk_half_payment

def test_model_consistency():
    """Test that model gives consistent results"""
    result1 = ai_service.predict_loan_approval(
        income=50000,
        credit_score=680,
        age=28,
        loan_amount=10000
    )
    
    result2 = ai_service.predict_loan_approval(
        income=50000,
        credit_score=680,
        age=28,
        loan_amount=10000
    )
    
    assert result1["approval_status"] == result2["approval_status"]
    assert abs(result1["approval_probability"] - result2["approval_probability"]) < 0.001

