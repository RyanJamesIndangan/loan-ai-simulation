import React, { useState, useEffect } from 'react';
import { getHealth, getModelInfo, getStatistics } from '../services/api';
import ApplicationList from '../components/ApplicationList';
import DemoControls from '../components/DemoControls';

function Home() {
  const [health, setHealth] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    setLoading(true);
    const [healthRes, modelRes, statsRes] = await Promise.all([
      getHealth(),
      getModelInfo(),
      getStatistics(),
    ]);

    if (healthRes.success) setHealth(healthRes.data);
    if (modelRes.success) setModelInfo(modelRes.data);
    if (statsRes.success) setStats(statsRes.data);

    setLoading(false);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Loan Decisioning Dashboard
        </h1>
        <p className='text-gray-600'>
          AI-powered loan application processing and risk assessment
        </p>
      </div>

      {/* System Status Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {/* Health Status */}
        <div className='card'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-lg font-semibold text-gray-700'>System Status</h3>
            {health && (
              <span className='badge-success'>
                {health.status === 'healthy' ? '● Online' : '○ Offline'}
              </span>
            )}
          </div>
          {loading ? (
            <p className='text-gray-500 text-sm'>Loading...</p>
          ) : health ? (
            <div className='text-sm text-gray-600'>
              <p>Service: {health.service}</p>
              <p>Version: {health.version}</p>
            </div>
          ) : (
            <p className='text-red-500 text-sm'>Unable to connect</p>
          )}
        </div>

        {/* Model Info */}
        <div className='card'>
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>ML Model</h3>
          {loading ? (
            <p className='text-gray-500 text-sm'>Loading...</p>
          ) : modelInfo ? (
            <div className='text-sm text-gray-600'>
              <p>Status: <span className='font-medium'>{modelInfo.status}</span></p>
              <p>Type: {modelInfo.model_type || 'N/A'}</p>
              {modelInfo.features && (
                <p className='text-xs mt-1'>Features: {modelInfo.features.length}</p>
              )}
            </div>
          ) : (
            <p className='text-gray-500 text-sm'>Model info unavailable</p>
          )}
        </div>

        {/* Statistics */}
        <div className='card'>
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>Statistics</h3>
          {loading ? (
            <p className='text-gray-500 text-sm'>Loading...</p>
          ) : stats ? (
            <div className='text-sm text-gray-600'>
              <p>Total Loans: <span className='font-bold'>{stats.total_loans}</span></p>
              <p>Approved: <span className='text-green-600 font-medium'>{stats.approved_loans}</span></p>
              <p>Rejected: <span className='text-red-600 font-medium'>{stats.rejected_loans}</span></p>
              <p>Approval Rate: <span className='font-medium'>{(stats.approval_rate * 100).toFixed(1)}%</span></p>
            </div>
          ) : (
            <p className='text-gray-500 text-sm'>Stats unavailable</p>
          )}
        </div>
      </div>

      {/* Demo Controls */}
      <div className='mb-8'>
        <DemoControls onDemoComplete={loadSystemInfo} />
      </div>

      {/* Application List */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Recent Applications</h2>
        <ApplicationList />
      </div>
    </div>
  );
}

export default Home;

