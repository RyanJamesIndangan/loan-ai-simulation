import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicationCard({ loan }) {
  const navigate = useNavigate();

  const getRiskClass = (riskScore) => {
    if (riskScore < 0.3) return 'risk-low';
    if (riskScore < 0.6) return 'risk-medium';
    return 'risk-high';
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return 'badge-success';
    if (status === 'rejected') return 'badge-danger';
    return 'badge-warning';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      onClick={() => navigate(`/app/${loan.loan_id}`)}
      className='card hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-primary-500'
    >
      {/* Header */}
      <div className='flex justify-between items-start mb-3'>
        <div>
          <h3 className='font-semibold text-gray-900 truncate'>{loan.applicant_name}</h3>
          <p className='text-xs text-gray-500'>ID: #{loan.loan_id}</p>
        </div>
        <span className={`risk-indicator ${getRiskClass(loan.risk_score)}`}></span>
      </div>

      {/* Amount */}
      <div className='mb-3'>
        <p className='text-2xl font-bold text-gray-900'>{formatCurrency(loan.loan_amount)}</p>
        <p className='text-xs text-gray-600'>Requested Amount</p>
      </div>

      {/* Status */}
      <div className='mb-3'>
        <span className={`${getStatusBadge(loan.approval_status)} text-xs`}>
          {loan.approval_status.toUpperCase()}
        </span>
      </div>

      {/* Details */}
      <div className='grid grid-cols-2 gap-2 text-xs border-t pt-3'>
        <div>
          <p className='text-gray-500'>Credit Score</p>
          <p className='font-medium'>{loan.credit_score}</p>
        </div>
        <div>
          <p className='text-gray-500'>Income</p>
          <p className='font-medium'>{formatCurrency(loan.income)}</p>
        </div>
        <div>
          <p className='text-gray-500'>Risk Score</p>
          <p className='font-medium'>{(loan.risk_score * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className='text-gray-500'>Fraud Risk</p>
          <p className='font-medium capitalize'>{loan.fraud_level}</p>
        </div>
      </div>

      {/* Click indicator */}
      <div className='mt-3 text-center'>
        <span className='text-xs text-primary-600 font-medium'>Click to view details →</span>
      </div>
    </div>
  );
}

export default ApplicationCard;

