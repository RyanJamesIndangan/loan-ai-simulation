import React, { useState, useEffect } from 'react';
import { getLoans } from '../services/api';
import ApplicationCard from './ApplicationCard';

function ApplicationList() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    setError(null);

    const result = await getLoans(0, 50);

    if (result.success) {
      setLoans(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className='card text-center py-12'>
        <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
        <p className='text-gray-600 mt-4'>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='card bg-red-50 border-red-200'>
        <p className='text-red-800'>Error loading applications: {error}</p>
        <button onClick={loadLoans} className='btn-primary mt-4'>
          Retry
        </button>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className='card text-center py-12'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <p className='text-gray-600 mt-4'>No applications yet</p>
        <p className='text-gray-500 text-sm'>Submit your first loan application to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-gray-600'>{loans.length} application{loans.length !== 1 ? 's' : ''} found</p>
        <button onClick={loadLoans} className='btn-secondary text-sm'>
          Refresh
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loans.map((loan) => (
          <ApplicationCard key={loan.loan_id} loan={loan} />
        ))}
      </div>
    </div>
  );
}

export default ApplicationList;

