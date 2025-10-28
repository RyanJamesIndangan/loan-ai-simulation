import React, { useState } from 'react';
import { replayDemo } from '../services/api';

function DemoControls({ onDemoComplete }) {
  const [batchSize, setBatchSize] = useState(10);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const handleReplayDemo = async () => {
    setRunning(true);
    setProgress(0);
    setResults(null);

    const result = await replayDemo(batchSize);

    if (result.success) {
      const approved = result.data.filter(r => r.result.success && r.result.data.approval_status === 'approved').length;
      const rejected = result.data.filter(r => r.result.success && r.result.data.approval_status === 'rejected').length;
      const errors = result.data.filter(r => !r.result.success).length;

      setResults({
        total: result.data.length,
        approved,
        rejected,
        errors,
      });

      if (onDemoComplete) {
        onDemoComplete();
      }
    } else {
      setResults({
        error: result.error,
      });
    }

    setProgress(100);
    setRunning(false);
  };

  return (
    <div className='card bg-gradient-to-r from-primary-50 to-blue-50'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>Demo Mode</h3>
          <p className='text-sm text-gray-600'>Generate and submit synthetic loan applications</p>
        </div>
        <svg
          className='w-8 h-8 text-primary-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 10V3L4 14h7v7l9-11h-7z'
          />
        </svg>
      </div>

      <div className='flex items-end gap-4 mb-4'>
        <div className='flex-grow'>
          <label htmlFor='batchSize' className='label'>
            Number of Applications
          </label>
          <input
            type='number'
            id='batchSize'
            value={batchSize}
            onChange={(e) => setBatchSize(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
            className='input-field'
            min='1'
            max='50'
            disabled={running}
          />
        </div>
        <button
          onClick={handleReplayDemo}
          disabled={running}
          className='btn-primary whitespace-nowrap'
        >
          {running ? 'Running...' : 'Run Demo'}
        </button>
      </div>

      {running && (
        <div className='mb-4'>
          <div className='flex justify-between text-sm text-gray-600 mb-1'>
            <span>Processing applications...</span>
            <span>{progress}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-primary-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {results && !results.error && (
        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <h4 className='font-semibold text-gray-800 mb-3'>Results Summary</h4>
          <div className='grid grid-cols-4 gap-4 text-center'>
            <div>
              <p className='text-2xl font-bold text-gray-900'>{results.total}</p>
              <p className='text-xs text-gray-600'>Total</p>
            </div>
            <div>
              <p className='text-2xl font-bold text-green-600'>{results.approved}</p>
              <p className='text-xs text-gray-600'>Approved</p>
            </div>
            <div>
              <p className='text-2xl font-bold text-red-600'>{results.rejected}</p>
              <p className='text-xs text-gray-600'>Rejected</p>
            </div>
            <div>
              <p className='text-2xl font-bold text-yellow-600'>{results.errors}</p>
              <p className='text-xs text-gray-600'>Errors</p>
            </div>
          </div>
        </div>
      )}

      {results && results.error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800 text-sm'>Error: {results.error}</p>
        </div>
      )}
    </div>
  );
}

export default DemoControls;

