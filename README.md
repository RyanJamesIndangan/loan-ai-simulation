# 🤖 AI-Powered Loan Decisioning System

A complete, production-ready **AI-powered loan application and decisioning system** built with FastAPI, Machine Learning, PostgreSQL, and Docker. This system simulates a realistic loan lifecycle including application submission, AI-based approval/rejection, fraud detection, and repayment tracking.

![Python](https://img.shields.io/badge/python-3.10-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [ML Model Details](#-ml-model-details)
- [Development](#-development)
- [Testing](#-testing)
- [CI/CD](#-cicd)
- [Environment Variables](#-environment-variables)

---

## ✨ Features

### 🎯 Core Functionality
- **Loan Application Submission** - Accept and process loan applications with validation
- **AI-Powered Decisioning** - Machine learning model predicts approval/rejection
- **Risk Scoring** - Calculate risk scores for each application
- **Fraud Detection** - Mock fraud detection system with configurable rules
- **Repayment Tracking** - Track loan repayment progress and update risk scores
- **Model Retraining** - Endpoint to retrain ML model with latest data

### 🔒 Production Features
- **RESTful API** with FastAPI
- **PostgreSQL Database** with SQLAlchemy ORM
- **Docker Containerization** for easy deployment
- **Health Checks** and monitoring endpoints
- **Comprehensive Testing** with pytest
- **CI/CD Pipeline** with GitHub Actions
- **API Documentation** with Swagger UI and ReDoc

---

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         FastAPI Application         │
│  ┌──────────┐      ┌─────────────┐ │
│  │  Routes  │──────│  Services   │ │
│  └──────────┘      └─────────────┘ │
│       │                    │        │
│       │            ┌───────┴──────┐ │
│       │            │              │ │
│       │            ▼              ▼ │
│       │      ┌──────────┐  ┌──────────┐
│       └──────│    DB    │  │ ML Model │
│              │ Service  │  │ Service  │
│              └──────────┘  └──────────┘
└─────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐    ┌──────────────┐
│   PostgreSQL    │    │ Scikit-learn │
│    Database     │    │    Model     │
└─────────────────┘    └──────────────┘
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend Framework** | FastAPI 0.104.1 |
| **Machine Learning** | scikit-learn 1.3.2 |
| **Database** | PostgreSQL 15 |
| **ORM** | SQLAlchemy 2.0.23 |
| **Web Server** | Uvicorn |
| **Containerization** | Docker & Docker Compose |
| **Testing** | pytest |
| **CI/CD** | GitHub Actions |
| **Data Processing** | pandas, numpy |

---

## 📁 Project Structure

```
ai-loan-decisioning/
├── api/
│   ├── main.py              # FastAPI application entry point
│   ├── routes/
│   │   ├── loan.py          # Loan-related endpoints
│   │   └── training.py      # Model training endpoints
│   ├── models/
│   │   ├── base.py          # Database configuration
│   │   ├── user_model.py    # User ORM model
│   │   └── loan_model.py    # Loan ORM model
│   └── services/
│       ├── ai_service.py    # ML model service
│       └── db_service.py    # Database operations
├── ml/
│   ├── train_model.py       # Model training script
│   ├── model.pkl            # Trained ML model (generated)
│   ├── scaler.pkl           # Feature scaler (generated)
│   └── data/
│       └── mock_loans.csv   # Mock training data
├── tests/
│   ├── test_api.py          # API endpoint tests
│   └── test_model.py        # ML model tests
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline
├── requirements.txt         # Python dependencies
├── docker-compose.yml       # Docker services configuration
├── Dockerfile              # Docker image definition
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** installed
- (Optional) Python 3.10+ for local development

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd loan-ai-simulation
```

### 2️⃣ Start the Application

```bash
docker-compose up --build
```

This will:
1. Build the FastAPI application container
2. Start PostgreSQL database
3. Train the ML model
4. Initialize database tables
5. Start the API server on `http://localhost:8000`

### 3️⃣ Access the API

- **Swagger UI**: http://localhost:8000/
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## 📚 API Documentation

### 🔹 POST `/api/apply-loan`

Submit a loan application.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 35,
  "income": 75000,
  "credit_score": 750,
  "loan_amount": 20000
}
```

**Response:**
```json
{
  "loan_id": 1,
  "user_id": 1,
  "applicant_name": "John Doe",
  "applicant_email": "john.doe@example.com",
  "income": 75000,
  "credit_score": 750,
  "age": 35,
  "loan_amount": 20000,
  "approval_status": "approved",
  "risk_score": 0.23,
  "fraud_score": 0.05,
  "fraud_level": "low",
  "approval_probability": 0.77,
  "repayment_status": "not_started",
  "repayment_amount": 0
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/apply-loan" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 35,
    "income": 75000,
    "credit_score": 750,
    "loan_amount": 20000
  }'
```

---

### 🔹 GET `/api/loans`

Get all loan applications (with pagination).

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records (default: 100)

**Response:**
```json
[
  {
    "loan_id": 1,
    "user_id": 1,
    "applicant_name": "John Doe",
    "approval_status": "approved",
    "risk_score": 0.23,
    ...
  }
]
```

**cURL Example:**
```bash
curl "http://localhost:8000/api/loans?skip=0&limit=10"
```

---

### 🔹 GET `/api/loans/{loan_id}`

Get a specific loan by ID.

**cURL Example:**
```bash
curl "http://localhost:8000/api/loans/1"
```

---

### 🔹 POST `/api/repay-loan/{loan_id}`

Make a repayment on an approved loan.

**Request Body:**
```json
{
  "amount": 5000
}
```

**Response:**
Updated loan object with new repayment status and recalculated risk score.

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/repay-loan/1" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000}'
```

---

### 🔹 GET `/api/statistics`

Get loan statistics.

**Response:**
```json
{
  "total_loans": 100,
  "approved_loans": 65,
  "rejected_loans": 35,
  "approval_rate": 0.65
}
```

---

### 🔹 POST `/api/retrain-model`

Trigger ML model retraining.

**Response:**
```json
{
  "message": "Model retrained successfully",
  "accuracy": 0.87,
  "status": "success"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/retrain-model"
```

---

### 🔹 GET `/api/model-info`

Get information about the loaded ML model.

**Response:**
```json
{
  "status": "loaded",
  "message": "Model is loaded and ready",
  "model_type": "RandomForestClassifier",
  "features": ["income", "credit_score", "age", "loan_amount"]
}
```

---

## 🧠 ML Model Details

### Model Type
**Random Forest Classifier** with 100 estimators

### Features
1. **Income** - Annual income of applicant
2. **Credit Score** - Credit score (300-850)
3. **Age** - Age of applicant
4. **Loan Amount** - Requested loan amount

### Training Process

The model is trained on:
- 50 samples from `ml/data/mock_loans.csv`
- 500 programmatically generated samples
- Total: 550 training samples with 80/20 train-test split

### Performance Metrics

Typical accuracy: **85-90%**

### Approval Logic

The model predicts approval probability based on:
- Higher income → Higher approval chance
- Higher credit score → Higher approval chance
- Moderate age (30-45) → Optimal
- Lower debt-to-income ratio → Higher approval chance

### Fraud Detection

Mock fraud detection flags suspicious patterns:
- Loan amount > 2x income
- Very high income for young age
- High loan amount with low credit score
- Extreme/unusual values

---

## 💻 Development

### Local Development Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Start PostgreSQL:**
```bash
docker-compose up db
```

4. **Train the model:**
```bash
python ml/train_model.py
```

5. **Run the application:**
```bash
uvicorn api.main:app --reload
```

---

## 🧪 Testing

### Run All Tests

```bash
pytest tests/ -v
```

### Run Specific Test File

```bash
pytest tests/test_api.py -v
pytest tests/test_model.py -v
```

### Test Coverage

```bash
pytest --cov=api --cov=ml tests/
```

### Test Categories

- **API Tests** (`test_api.py`): Test all API endpoints
- **Model Tests** (`test_model.py`): Test ML model predictions and fraud detection

---

## 🔄 CI/CD

The project includes a comprehensive GitHub Actions pipeline that:

### On Push/Pull Request:

1. **Lint and Test**
   - Code linting with flake8
   - Code formatting check with black
   - Run all pytest tests
   - Generate test coverage report

2. **Docker Build**
   - Build Docker image
   - Test Docker image functionality

3. **Security Scan**
   - Dependency vulnerability scan with safety
   - Code security scan with bandit

### Workflow File

See `.github/workflows/ci.yml` for full pipeline configuration.

---

## 🌍 Environment Variables

Create a `.env` file for local development:

```env
# Database Configuration
DATABASE_URL=postgresql://admin:admin@localhost:5432/loan_ai

# Application Configuration
APP_NAME="AI Loan Decisioning System"
APP_VERSION=1.0.0
DEBUG=True

# Model Configuration
MODEL_PATH=ml/model.pkl
SCALER_PATH=ml/scaler.pkl
```

---

## 🎓 Usage Examples

### Example 1: High-Quality Applicant (Should be Approved)

```bash
curl -X POST "http://localhost:8000/api/apply-loan" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Johnson",
    "email": "sarah.j@example.com",
    "age": 38,
    "income": 85000,
    "credit_score": 780,
    "loan_amount": 25000
  }'
```

Expected: `"approval_status": "approved"`

---

### Example 2: Low-Quality Applicant (Should be Rejected)

```bash
curl -X POST "http://localhost:8000/api/apply-loan" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mike Smith",
    "email": "mike.s@example.com",
    "age": 22,
    "income": 28000,
    "credit_score": 540,
    "loan_amount": 40000
  }'
```

Expected: `"approval_status": "rejected"`

---

### Example 3: Make Loan Repayment

First, submit and get approved for a loan, then:

```bash
# Make a $3000 repayment on loan ID 1
curl -X POST "http://localhost:8000/api/repay-loan/1" \
  -H "Content-Type: application/json" \
  -d '{"amount": 3000}'
```

---

### Example 4: View All Loans

```bash
curl "http://localhost:8000/api/loans"
```

---

## 🐳 Docker Commands

### Start services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Rebuild images
```bash
docker-compose up --build
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f app
```

### Access database
```bash
docker exec -it loan-postgres psql -U admin -d loan_ai
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- ML powered by [scikit-learn](https://scikit-learn.org/)
- Database: [PostgreSQL](https://www.postgresql.org/)

---

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ and AI**

