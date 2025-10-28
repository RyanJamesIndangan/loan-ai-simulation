import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLoanDetail } from '../services/api';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLoanDetail();
  }, [id]);

  const loadLoanDetail = async () => {
    setLoading(true);
    setError(null);

    const result = await getLoanDetail(id);

    if (result.success) {
      setLoan(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const getRiskLevel = (riskScore) => {
    if (riskScore < 0.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (riskScore < 0.6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getFraudLevel = (fraudLevel) => {
    const levels = {
      low: { color: 'text-green-600', bg: 'bg-green-100' },
      medium: { color: 'text-yellow-600', bg: 'bg-yellow-100' },
      high: { color: 'text-red-600', bg: 'bg-red-100' },
    };
    return levels[fraudLevel] || levels.medium;
  };

  const getTopFeatures = (loan) => {
    // Mock feature importance - in real scenario, backend would return this
    const features = [
      { name: 'Credit Score', value: loan.credit_score, importance: 0.35, impact: loan.credit_score > 700 ? 'positive' : 'negative' },
      { name: 'Income', value: `$${loan.income.toLocaleString()}`, importance: 0.28, impact: loan.income > 50000 ? 'positive' : 'negative' },
      { name: 'Debt-to-Income Ratio', value: ((loan.loan_amount / loan.income) * 100).toFixed(1) + '%', importance: 0.22, impact: (loan.loan_amount / loan.income) < 0.4 ? 'positive' : 'negative' },
      { name: 'Age', value: loan.age, importance: 0.10, impact: loan.age >= 25 ? 'positive' : 'negative' },
      { name: 'Loan Amount', value: `$${loan.loan_amount.toLocaleString()}`, importance: 0.05, impact: loan.loan_amount < 30000 ? 'positive' : 'negative' },
    ];
    return features.sort((a, b) => b.importance - a.importance);
  };

  if (loading) {
    return (
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='card text-center'>
          <p className='text-gray-600'>Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='card'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>Error</h2>
          <p className='text-gray-700 mb-4'>{error}</p>
          <button onClick={() => navigate('/')} className='btn-primary'>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const riskInfo = getRiskLevel(loan.risk_score);
  const fraudInfo = getFraudLevel(loan.fraud_level);
  const features = getTopFeatures(loan);

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='mb-6'>
        <button
          onClick={() => navigate('/')}
          className='text-primary-600 hover:text-primary-800 font-medium mb-2 flex items-center'
        >
          ← Back to Dashboard
        </button>
        <h1 className='text-3xl font-bold text-gray-900'>Application Details</h1>
      </div>

      {/* Decision Banner */}
      <div className={`card mb-6 ${loan.approval_status === 'approved' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold mb-1'>
              Application {loan.approval_status === 'approved' ? 'Approved' : 'Rejected'}
            </h2>
            <p className='text-gray-600'>Loan ID: #{loan.loan_id}</p>
          </div>
          <div className='text-right'>
            <span className={`badge ${loan.approval_status === 'approved' ? 'badge-success' : 'badge-danger'} text-lg px-4 py-2`}>
              {loan.approval_status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* Applicant Information */}
        <div className='card'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>Applicant Information</h3>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Name:</span>
              <span className='font-medium'>{loan.applicant_name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Email:</span>
              <span className='font-medium'>{loan.applicant_email}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Age:</span>
              <span className='font-medium'>{loan.age} years</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Credit Score:</span>
              <span className='font-medium'>{loan.credit_score}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Annual Income:</span>
              <span className='font-medium'>${loan.income.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Requested Amount:</span>
              <span className='font-bold text-lg'>${loan.loan_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className='card'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>Risk Assessment</h3>
          <div className='space-y-4'>
            {/* Risk Score */}
            <div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-gray-700 font-medium'>Risk Score</span>
                <span className={`badge ${riskInfo.bg} ${riskInfo.color}`}>
                  {riskInfo.level} Risk
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className={`h-3 rounded-full ${loan.risk_score < 0.3 ? 'bg-green-500' : loan.risk_score < 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${loan.risk_score * 100}%` }}
                ></div>
              </div>
              <p className='text-xs text-gray-500 mt-1'>{(loan.risk_score * 100).toFixed(1)}%</p>
            </div>

            {/* Approval Probability */}
            <div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-gray-700 font-medium'>Approval Probability</span>
                <span className='text-gray-600 text-sm'>{(loan.approval_probability * 100).toFixed(1)}%</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className='h-3 rounded-full bg-blue-500'
                  style={{ width: `${loan.approval_probability * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Fraud Score */}
            <div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-gray-700 font-medium'>Fraud Score</span>
                <span className={`badge ${fraudInfo.bg} ${fraudInfo.color}`}>
                  {loan.fraud_level.toUpperCase()}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className={`h-3 rounded-full ${loan.fraud_score < 0.3 ? 'bg-green-500' : loan.fraud_score < 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${loan.fraud_score * 100}%` }}
                ></div>
              </div>
              <p className='text-xs text-gray-500 mt-1'>{(loan.fraud_score * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className='card mb-6'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          Decision Factors (Feature Importance)
        </h3>
        <p className='text-sm text-gray-600 mb-4'>
          These factors contributed most to the decision. Green indicates positive impact, red indicates negative impact.
        </p>
        <div className='space-y-3'>
          {features.map((feature, idx) => (
            <div key={idx}>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-sm font-medium text-gray-700'>{feature.name}</span>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>{feature.value}</span>
                  <span className={`text-xs px-2 py-1 rounded ${feature.impact === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feature.impact === 'positive' ? '↑' : '↓'}
                  </span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='flex-grow bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full ${feature.impact === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${feature.importance * 100}%` }}
                  ></div>
                </div>
                <span className='text-xs text-gray-500 w-12 text-right'>
                  {(feature.importance * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repayment Status */}
      <div className='card'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>Repayment Status</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
          <div>
            <p className='text-gray-600 text-sm mb-1'>Status</p>
            <p className='font-bold text-lg capitalize'>{loan.repayment_status.replace('_', ' ')}</p>
          </div>
          <div>
            <p className='text-gray-600 text-sm mb-1'>Amount Repaid</p>
            <p className='font-bold text-lg'>${loan.repayment_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-gray-600 text-sm mb-1'>Remaining</p>
            <p className='font-bold text-lg'>
              ${(loan.loan_amount - loan.repayment_amount).toLocaleString()}
            </p>
          </div>
        </div>
        {loan.approval_status === 'approved' && loan.repayment_amount < loan.loan_amount && (
          <div className='mt-4'>
            <div className='w-full bg-gray-200 rounded-full h-4'>
              <div
                className='h-4 rounded-full bg-primary-600 flex items-center justify-end pr-2'
                style={{ width: `${(loan.repayment_amount / loan.loan_amount) * 100}%` }}
              >
                <span className='text-white text-xs font-medium'>
                  {((loan.repayment_amount / loan.loan_amount) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationDetail;

