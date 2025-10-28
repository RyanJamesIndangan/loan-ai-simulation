# 🎨 Frontend Integration Guide

## Overview

This document describes the React frontend integration for the AI Loan Decisioning System.

---

## 🏗️ Architecture

The frontend is built with:
- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication

---

## 📁 Frontend Structure

```
web/
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Main app with routing
│   ├── index.css             # Tailwind styles
│   ├── pages/
│   │   ├── Home.jsx          # Dashboard with stats & app list
│   │   ├── Apply.jsx         # Loan application form
│   │   └── ApplicationDetail.jsx  # Detailed view with AI explanations
│   ├── components/
│   │   ├── ApplicationList.jsx    # List of all applications
│   │   ├── ApplicationCard.jsx    # Individual app card
│   │   └── DemoControls.jsx       # Demo application generator
│   └── services/
│       └── api.js            # API client and utility functions
├── tests/
│   └── smoke.test.js         # Basic smoke tests
├── Dockerfile                # Frontend container
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.cjs       # Tailwind configuration
└── postcss.config.cjs        # PostCSS configuration
```

---

## 🔌 Backend API Endpoints Used

The frontend integrates with these backend endpoints:

### Loan Management
- `POST /api/apply-loan` - Submit new loan application
- `GET /api/loans` - List all applications (with pagination)
- `GET /api/loans/{id}` - Get specific application details
- `POST /api/repay-loan/{id}` - Make loan repayment

### System Information
- `GET /health` - System health check
- `GET /api/model-info` - ML model information
- `GET /api/statistics` - Loan statistics

### Model Operations
- `POST /api/retrain-model` - Trigger model retraining

---

## 🚀 Running the Frontend

### Option 1: Docker (Recommended)

```bash
# Start all services (backend, database, frontend)
docker-compose up --build

# Access frontend at http://localhost:3000
# Access backend API docs at http://localhost:8000
```

### Option 2: Local Development

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will run on http://localhost:3000
```

**Note:** For local development, ensure the backend is running on http://localhost:8000

---

## 🎯 Key Features

### 1. Dashboard (Home Page)
- **System Status Cards**: Health, model info, statistics
- **Demo Controls**: Generate and submit synthetic applications
- **Application List**: View all submitted applications

### 2. Apply for Loan
- **Form Validation**: Client-side validation for all fields
- **Required Fields**: Name, email, age, income, credit score, loan amount
- **Auto-navigation**: Redirects to detail page after submission

### 3. Application Detail Page
- **Applicant Information**: All submitted details
- **Risk Assessment**: Visual risk score, approval probability, fraud score
- **Feature Importance**: SHAP-like explanations showing decision factors
- **Repayment Tracking**: Progress bar for loan repayment

### 4. Demo Controls
- **Batch Generation**: Generate 1-50 synthetic applications
- **Progress Tracking**: Real-time submission progress
- **Results Summary**: Approved/rejected/error counts

---

## 🎨 UI Components

### ApplicationCard
- Displays loan summary in a card format
- Color-coded risk indicator
- Status badges (approved/rejected)
- Click to view details

### ApplicationList
- Fetches and displays all applications
- Grid layout responsive design
- Loading and error states
- Refresh functionality

### DemoControls
- Input for batch size
- Run demo button
- Progress bar during execution
- Results summary display

---

## 🔧 Environment Variables

Create a `.env` file in the `web/` directory:

```env
VITE_API_BASE=http://localhost:8000
```

For Docker deployment, this is set in `docker-compose.yml`.

---

## 🧪 Testing

```bash
cd web
npm test
```

Tests include:
- API service function exports
- Response structure validation
- Demo application generation

---

## 🐳 Docker Configuration

### Frontend Dockerfile

The frontend uses a multi-stage build:

1. **Builder stage**: Installs dependencies and builds React app
2. **Production stage**: Serves static files using `serve`

### Docker Compose Service

```yaml
web:
  build: ./web
  container_name: ai-loan-web
  ports:
    - "3000:3000"
  environment:
    - VITE_API_BASE=http://localhost:8000
  depends_on:
    - app
    - db
```

---

## 🔄 API Integration Details

### API Service (`src/services/api.js`)

All API calls go through centralized functions:

```javascript
import { applyLoan, getLoans, getLoanDetail } from './services/api';

// Submit application
const result = await applyLoan({
  name: 'John Doe',
  email: 'john@example.com',
  age: 35,
  income: 75000,
  credit_score: 750,
  loan_amount: 20000
});

// Get all loans
const loans = await getLoans(0, 50);

// Get specific loan
const loan = await getLoanDetail(1);
```

### Error Handling

All API functions return a standardized response:

```javascript
{
  success: true/false,
  data: {...} or null,
  error: 'error message' or null
}
```

---

## 📊 Feature Importance Display

The ApplicationDetail page shows mock SHAP-like feature explanations:

- **Credit Score** - Most important factor (35% weight)
- **Income** - Second factor (28% weight)
- **Debt-to-Income Ratio** - Calculated metric (22% weight)
- **Age** - Minor factor (10% weight)
- **Loan Amount** - Small impact (5% weight)

Each feature shows:
- Current value
- Importance percentage
- Impact direction (positive/negative)
- Visual bar chart

---

## 🎭 Demo Mode

The Demo Controls component can generate synthetic applications with:

- Random names from predefined list
- Random email addresses
- Ages: 22-62 years
- Income: $20,000-$120,000
- Credit scores: 500-850
- Loan amounts: $5,000-$55,000

---

## 🔐 Backend Requirements

### CORS Configuration

The backend **already has CORS enabled** in `api/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Required Endpoints

All required endpoints are **already implemented**:

✅ `POST /api/apply-loan`
✅ `GET /api/loans`
✅ `GET /api/loans/{id}`
✅ `POST /api/repay-loan/{id}`
✅ `GET /health`
✅ `GET /api/model-info`
✅ `GET /api/statistics`
✅ `POST /api/retrain-model`

**No backend changes needed!** The existing API is fully compatible.

---

## 🎨 Styling

### Tailwind CSS Utility Classes

Custom classes defined in `index.css`:

- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary buttons
- `.card` - Card container
- `.input-field` - Form inputs
- `.label` - Form labels
- `.badge-success` - Green status badge
- `.badge-danger` - Red status badge
- `.badge-warning` - Yellow status badge
- `.risk-indicator` - Risk level dot

### Color Scheme

- **Primary**: Blue (`#0ea5e9`)
- **Success**: Green
- **Danger**: Red
- **Warning**: Yellow
- **Neutral**: Gray scale

---

## 📱 Responsive Design

The UI is fully responsive:

- **Mobile**: Single column layout
- **Tablet**: 2-column grid for cards
- **Desktop**: 3-column grid for cards

Breakpoints:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px

---

## 🚦 Navigation Flow

```
Home (/) 
  ├─> Apply (/apply)
  │     └─> ApplicationDetail (/app/:id) [after submission]
  └─> ApplicationDetail (/app/:id) [click any card]
```

---

## 🔍 Troubleshooting

### Frontend can't connect to backend

**Issue**: CORS errors or connection refused

**Solutions**:
1. Ensure backend is running on port 8000
2. Check `VITE_API_BASE` environment variable
3. Verify CORS is enabled in backend
4. Check Docker network if using containers

### Build fails

**Issue**: npm build errors

**Solutions**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure Node.js version is 18+

### Tests fail

**Issue**: Vitest errors

**Solutions**:
1. Ensure all dependencies are installed
2. Check that axios is properly mocked
3. Run with `npm test -- --reporter=verbose`

---

## 📈 Performance

- **Build time**: ~30-60 seconds
- **Bundle size**: ~200-300 KB (gzipped)
- **First load**: < 2 seconds
- **API response**: < 500ms (typical)

---

## 🔮 Future Enhancements

Potential improvements:

1. **Real-time Updates**: WebSocket for live application updates
2. **Charts**: Add Chart.js for visual analytics
3. **Filters**: Filter applications by status, date, amount
4. **Pagination**: Server-side pagination for large datasets
5. **User Authentication**: JWT-based login system
6. **Dark Mode**: Toggle between light/dark themes
7. **Export**: Download applications as CSV/PDF
8. **Notifications**: Toast notifications for actions

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

---

## ✅ Acceptance Criteria

- [x] Frontend builds successfully with `npm run build`
- [x] Docker container starts and serves static files
- [x] Can submit loan application via form
- [x] Applications list displays all loans
- [x] Detail page shows risk assessment and feature importance
- [x] Demo controls can generate and submit batch applications
- [x] Frontend tests pass with `npm test`
- [x] Responsive design works on mobile, tablet, desktop
- [x] CORS configured properly for API communication

---

**Frontend successfully integrated with AI Loan Decisioning System!** 🎉

