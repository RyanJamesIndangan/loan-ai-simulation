# 🚀 Quick Start Guide - AI Loan Decisioning System with React Frontend

## 📋 Prerequisites

- **Docker Desktop** installed and running
- **Git** installed
- **Node.js 18+** (for local development only)
- **Python 3.10+** (for local development only)

---

## ⚡ Quick Start (Docker - Recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/RyanJamesIndangan/loan-ai-simulation.git
cd loan-ai-simulation
```

### 2. Start All Services

```bash
docker-compose up --build
```

This command will:
- ✅ Build and start PostgreSQL database (port 5432)
- ✅ Build and start FastAPI backend (port 8000)
- ✅ Build and start React frontend (port 3000)
- ✅ Train ML model automatically
- ✅ Initialize database tables

### 3. Access the Application

- **Frontend UI**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000
- **Backend Health**: http://localhost:8000/health

---

## 🎯 Sample UI Interactions

### Test Case 1: Submit a Loan Application (Should be APPROVED)

1. Navigate to http://localhost:3000
2. Click "Apply for Loan" in the navigation bar
3. Fill out the form with these values:

```
Name: Sarah Johnson
Email: sarah.j@example.com
Age: 38
Income: 85000
Credit Score: 780
Loan Amount: 25000
```

4. Click "Submit Application"
5. **Expected Result**: Redirected to detail page showing "Application Approved" with:
   - Low risk score (< 30%)
   - High approval probability (> 70%)
   - Low fraud risk
   - Feature importance breakdown

### Test Case 2: Submit a Loan Application (Should be REJECTED)

1. Go to http://localhost:3000/apply
2. Fill out the form with these values:

```
Name: Mike Smith
Email: mike.s@example.com
Age: 22
Income: 25000
Credit Score: 540
Loan Amount: 45000
```

3. Click "Submit Application"
4. **Expected Result**: Redirected to detail page showing "Application Rejected" with:
   - High risk score (> 60%)
   - Low approval probability (< 40%)
   - Negative feature contributions visible

### Test Case 3: View All Applications

1. Navigate to http://localhost:3000 (Dashboard)
2. Scroll down to "Recent Applications"
3. **Expected Result**: See list of all submitted applications in card format
4. Click any card to view detailed decision breakdown

### Test Case 4: Run Demo Mode (Batch Applications)

1. Go to http://localhost:3000 (Dashboard)
2. Find "Demo Mode" section
3. Set "Number of Applications" to 10
4. Click "Run Demo"
5. **Expected Result**:
   - Progress bar shows submission status
   - Results summary shows breakdown (e.g., 6 approved, 4 rejected)
   - Application list updates with new entries
   - Statistics cards update with new totals

### Test Case 5: Check System Health

1. Open http://localhost:3000
2. Look at the top three cards:
   - **System Status**: Should show "● Online"
   - **ML Model**: Should show "Status: loaded"
   - **Statistics**: Should show total loans, approval rate

---

## 🧪 Testing the System

### Backend Tests

```bash
# Run from project root
pytest tests/ -v
```

**Expected Output:**
```
tests/test_api.py::test_health_check PASSED
tests/test_api.py::test_apply_loan_approved PASSED
tests/test_api.py::test_apply_loan_rejected PASSED
tests/test_model.py::test_loan_approval_prediction PASSED
... (all tests should pass)
```

### Frontend Tests

```bash
# Navigate to web directory
cd web

# Install dependencies (first time only)
npm install

# Run tests
npm test
```

**Expected Output:**
```
✓ src/tests/smoke.test.js (5)
  ✓ API Service Smoke Tests (5)
    ✓ should export applyLoan function
    ✓ should export getLoans function
    ✓ should export getLoanDetail function
    ✓ should return success response structure from applyLoan
    ✓ should generate demo applications

Test Files  1 passed (1)
Tests  5 passed (5)
```

---

## 🔄 Manual API Testing (cURL)

### 1. Health Check

```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "AI Loan Decisioning System",
  "version": "1.0.0"
}
```

### 2. Submit Loan Application (Approved)

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

**Expected Response:**
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

### 3. Get All Loans

```bash
curl http://localhost:8000/api/loans
```

**Expected Response:** Array of loan objects

### 4. Get Specific Loan

```bash
curl http://localhost:8000/api/loans/1
```

### 5. Get Statistics

```bash
curl http://localhost:8000/api/statistics
```

**Expected Response:**
```json
{
  "total_loans": 5,
  "approved_loans": 3,
  "rejected_loans": 2,
  "approval_rate": 0.6
}
```

---

## 🏃 Local Development (Without Docker)

### Backend

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start PostgreSQL (using Docker for DB only)
docker run -d \
  --name loan-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=loan_ai \
  -p 5432:5432 \
  postgres:15

# Train ML model
python ml/train_model.py

# Start backend
uvicorn api.main:app --reload
```

Backend will run on http://localhost:8000

### Frontend

```bash
# In a new terminal
cd web

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

---

## 📊 Expected Behavior Summary

| Action | Expected Result |
|--------|-----------------|
| Submit high-quality applicant | Status: Approved, Risk < 30%, Fraud: Low |
| Submit low-quality applicant | Status: Rejected, Risk > 60% |
| Submit suspicious application | Fraud score increases, may auto-reject |
| Run demo with 10 apps | ~60% approval rate (varies) |
| View dashboard | Shows health, stats, recent applications |
| Click application card | Shows detailed risk breakdown |
| Check feature importance | Shows top 5 factors with impact direction |

---

## 🐳 Docker Commands Reference

### Start services
```bash
docker-compose up --build
```

### Start in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f

# Or specific service
docker-compose logs -f app   # Backend
docker-compose logs -f web   # Frontend
docker-compose logs -f db    # Database
```

### Rebuild specific service
```bash
docker-compose up --build app   # Rebuild backend
docker-compose up --build web   # Rebuild frontend
```

### Access database directly
```bash
docker exec -it loan-postgres psql -U admin -d loan_ai

# Inside PostgreSQL:
\dt                    # List tables
SELECT * FROM loans;   # View loans
\q                     # Quit
```

---

## 🔍 Troubleshooting

### Issue: "Docker daemon not running"

**Solution:**
1. Start Docker Desktop
2. Wait for Docker to fully start (icon in system tray)
3. Run `docker ps` to verify it's working

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or change port in docker-compose.yml:
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### Issue: "Port 8000 already in use"

**Solution:** Same as above, but for port 8000

### Issue: Frontend shows "Network Error"

**Solution:**
1. Check backend is running: http://localhost:8000/health
2. Check CORS is enabled in backend (already configured)
3. Verify `VITE_API_BASE` environment variable
4. Check browser console for specific error

### Issue: "Module not found" in frontend

**Solution:**
```bash
cd web
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database connection failed

**Solution:**
1. Ensure PostgreSQL container is running: `docker ps`
2. Check database health: `docker-compose logs db`
3. Restart database service: `docker-compose restart db`

---

## 📈 Performance Benchmarks

| Metric | Value |
|--------|-------|
| Backend startup time | ~5-10 seconds |
| Frontend build time | ~30-60 seconds |
| Frontend load time | < 2 seconds |
| API response time | < 500ms |
| ML inference time | < 100ms |
| Demo batch (10 apps) | ~5-10 seconds |

---

## ✅ Acceptance Criteria Checklist

- [x] `docker-compose up --build` starts all three services (db, app, web)
- [x] Frontend accessible at http://localhost:3000
- [x] Backend accessible at http://localhost:8000
- [x] Can submit loan application via UI form
- [x] Applications list displays all loans from database
- [x] Detail page shows risk assessment and feature importance
- [x] Demo controls can generate and submit batch applications
- [x] Statistics update in real-time
- [x] Frontend tests pass with `npm test`
- [x] Backend tests pass with `pytest`
- [x] CI/CD pipeline includes frontend testing
- [x] Responsive design works on mobile/tablet/desktop

---

## 🎓 Next Steps

1. **Explore the UI**: Submit various applications with different profiles
2. **Try Demo Mode**: Generate 10-20 applications to see statistics change
3. **Check Feature Importance**: See how different factors affect decisions
4. **Review the Code**: Explore `web/src/` for React components
5. **Customize**: Modify Tailwind styles, add new features
6. **Deploy**: Use Docker images for cloud deployment

---

## 📚 Documentation

- **README.md** - Project overview and backend details
- **FRONTEND_SETUP.md** - Frontend architecture and integration
- **VERIFICATION.md** - Testing and verification guide
- **QUICKSTART.md** (this file) - Quick start commands

---

## 🎉 Success!

If you can:
1. ✅ Access the frontend at http://localhost:3000
2. ✅ Submit a loan application
3. ✅ See the application in the list
4. ✅ View decision details with risk breakdown
5. ✅ Run demo mode successfully

**Congratulations! Your AI Loan Decisioning System with React UI is fully operational!** 🚀

---

**Built with ❤️ using FastAPI, ML, PostgreSQL, React, and Docker**

