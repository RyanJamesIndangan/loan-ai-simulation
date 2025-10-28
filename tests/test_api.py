import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api.main import app
from api.models import Base, get_db

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def test_client():
    Base.metadata.create_all(bind=engine)
    client = TestClient(app)
    yield client
    Base.metadata.drop_all(bind=engine)

def test_health_check(test_client):
    """Test health check endpoint"""
    response = test_client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_apply_loan_approved(test_client):
    """Test loan application that should be approved"""
    loan_data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "age": 35,
        "income": 75000,
        "credit_score": 750,
        "loan_amount": 20000
    }
    
    response = test_client.post("/api/apply-loan", json=loan_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "loan_id" in data
    assert data["approval_status"] == "approved"
    assert data["applicant_name"] == "John Doe"
    assert data["risk_score"] < 0.5

def test_apply_loan_rejected(test_client):
    """Test loan application that should be rejected"""
    loan_data = {
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "age": 22,
        "income": 25000,
        "credit_score": 550,
        "loan_amount": 30000
    }
    
    response = test_client.post("/api/apply-loan", json=loan_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "loan_id" in data
    assert data["approval_status"] == "rejected"
    assert data["risk_score"] > 0.5

def test_get_loans(test_client):
    """Test getting all loans"""
    response = test_client.get("/api/loans")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 2  # At least 2 from previous tests

def test_get_loan_by_id(test_client):
    """Test getting a specific loan"""
    # First create a loan
    loan_data = {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "age": 30,
        "income": 60000,
        "credit_score": 700,
        "loan_amount": 15000
    }
    
    create_response = test_client.post("/api/apply-loan", json=loan_data)
    loan_id = create_response.json()["loan_id"]
    
    # Get the loan
    response = test_client.get(f"/api/loans/{loan_id}")
    assert response.status_code == 200
    assert response.json()["loan_id"] == loan_id

def test_repay_loan(test_client):
    """Test loan repayment"""
    # First create an approved loan
    loan_data = {
        "name": "Bob Wilson",
        "email": "bob@example.com",
        "age": 40,
        "income": 80000,
        "credit_score": 780,
        "loan_amount": 25000
    }
    
    create_response = test_client.post("/api/apply-loan", json=loan_data)
    loan_id = create_response.json()["loan_id"]
    
    # Make a repayment
    repayment_data = {"amount": 5000}
    response = test_client.post(f"/api/repay-loan/{loan_id}", json=repayment_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["repayment_amount"] == 5000
    assert data["repayment_status"] == "in_progress"

def test_statistics(test_client):
    """Test statistics endpoint"""
    response = test_client.get("/api/statistics")
    assert response.status_code == 200
    
    data = response.json()
    assert "total_loans" in data
    assert "approved_loans" in data
    assert "rejected_loans" in data
    assert "approval_rate" in data

def test_model_info(test_client):
    """Test model info endpoint"""
    response = test_client.get("/api/model-info")
    assert response.status_code == 200
    
    data = response.json()
    assert "status" in data
    assert "model_type" in data

def test_invalid_loan_application(test_client):
    """Test invalid loan application data"""
    invalid_data = {
        "name": "Invalid User",
        "email": "not-an-email",  # Invalid email
        "age": 35,
        "income": 50000,
        "credit_score": 700,
        "loan_amount": 10000
    }
    
    response = test_client.post("/api/apply-loan", json=invalid_data)
    assert response.status_code == 422  # Validation error

def test_loan_not_found(test_client):
    """Test getting non-existent loan"""
    response = test_client.get("/api/loans/99999")
    assert response.status_code == 404

