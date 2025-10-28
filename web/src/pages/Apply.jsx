import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyLoan } from '../services/api';

function Apply() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    income: '',
    credit_score: '',
    loan_amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!formData.email || !formData.email.includes('@')) {
      return 'Valid email is required';
    }
    const age = parseInt(formData.age);
    if (!age || age < 18 || age > 100) {
      return 'Age must be between 18 and 100';
    }
    const income = parseFloat(formData.income);
    if (!income || income <= 0) {
      return 'Income must be greater than 0';
    }
    const creditScore = parseInt(formData.credit_score);
    if (!creditScore || creditScore < 300 || creditScore > 850) {
      return 'Credit score must be between 300 and 850';
    }
    const loanAmount = parseFloat(formData.loan_amount);
    if (!loanAmount || loanAmount <= 0) {
      return 'Loan amount must be greater than 0';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      income: parseFloat(formData.income),
      credit_score: parseInt(formData.credit_score),
      loan_amount: parseFloat(formData.loan_amount),
    };

    const result = await applyLoan(payload);

    if (result.success) {
      // Navigate to application detail page
      navigate(`/app/${result.data.loan_id}`);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Apply for a Loan</h1>
        <p className='text-gray-600 mb-6'>
          Fill out the form below to submit your loan application. Our AI system will evaluate your application instantly.
        </p>

        {error && (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-800 text-sm'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Personal Information */}
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Personal Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='name' className='label'>
                  Full Name *
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='input-field'
                  placeholder='John Doe'
                  required
                />
              </div>

              <div>
                <label htmlFor='email' className='label'>
                  Email Address *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='input-field'
                  placeholder='john.doe@example.com'
                  required
                />
              </div>

              <div>
                <label htmlFor='age' className='label'>
                  Age *
                </label>
                <input
                  type='number'
                  id='age'
                  name='age'
                  value={formData.age}
                  onChange={handleChange}
                  className='input-field'
                  placeholder='35'
                  min='18'
                  max='100'
                  required
                />
              </div>

              <div>
                <label htmlFor='credit_score' className='label'>
                  Credit Score *
                </label>
                <input
                  type='number'
                  id='credit_score'
                  name='credit_score'
                  value={formData.credit_score}
                  onChange={handleChange}
                  className='input-field'
                  placeholder='720'
                  min='300'
                  max='850'
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Financial Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='income' className='label'>
                  Annual Income ($) *
                </label>
                <input
                  type='number'
                  id='income'
                  name='income'
                  value={formData.income}
                  onChange={handleChange}
                  className='input-field'
                  placeholder='75000'
                  min='0'
                  step='1000'
                  required
                />
              </div>

              <div>
                <label htmlFor='loan_amount' className='label'>
                  Requested Loan Amount ($) *
                </label>
                <input
                  type='number'
                  id='loan_amount'
                  name='loan_amount'
                  value={formData.loan_amount}
                  onChange={handleChange}
                  className='input-field'
                  placeholder='25000'
                  min='0'
                  step='1000'
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='btn-secondary'
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn-primary'
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Apply;

