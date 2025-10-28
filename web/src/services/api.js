import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler helper
const handleError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    error: error.response?.data?.detail || error.message || 'An error occurred',
  };
};

// Apply for a loan
export const applyLoan = async (payload) => {
  try {
    const response = await api.post('/api/apply-loan', payload);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Get all loans
export const getLoans = async (skip = 0, limit = 100) => {
  try {
    const response = await api.get('/api/loans', {
      params: { skip, limit },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Get loan detail by ID
export const getLoanDetail = async (id) => {
  try {
    const response = await api.get(`/api/loans/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Get health status
export const getHealth = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Get model info
export const getModelInfo = async () => {
  try {
    const response = await api.get('/api/model-info');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Get statistics
export const getStatistics = async () => {
  try {
    const response = await api.get('/api/statistics');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Retrain model
export const retrainModel = async () => {
  try {
    const response = await api.post('/api/retrain-model');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Replay demo - submit batch of applications
export const replayDemo = async (batchSize = 10) => {
  try {
    const demoApplications = generateDemoApplications(batchSize);
    const results = [];

    for (const app of demoApplications) {
      const result = await applyLoan(app);
      results.push({ application: app, result });
    }

    return { success: true, data: results };
  } catch (error) {
    return handleError(error);
  }
};

// Generate demo applications client-side
export const generateDemoApplications = (count = 10) => {
  const names = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Johnson', 'Charlie Brown', 'Diana Prince', 'Eve Adams', 'Frank Castle', 'Grace Lee', 'Henry Ford'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];

  const applications = [];

  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const email = `${name.toLowerCase().replace(' ', '.')}${i}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const age = Math.floor(Math.random() * 40) + 22; // 22-62
    const income = Math.floor(Math.random() * 100000) + 20000; // 20k-120k
    const creditScore = Math.floor(Math.random() * 350) + 500; // 500-850
    const loanAmount = Math.floor(Math.random() * 50000) + 5000; // 5k-55k

    applications.push({
      name: `${name} ${i}`,
      email,
      age,
      income,
      credit_score: creditScore,
      loan_amount: loanAmount,
    });
  }

  return applications;
};

export default api;

