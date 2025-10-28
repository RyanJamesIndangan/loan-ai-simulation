import { describe, it, expect, vi } from 'vitest';

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        post: vi.fn(() => Promise.resolve({
          data: {
            loan_id: 1,
            approval_status: 'approved',
            risk_score: 0.3,
          },
        })),
        get: vi.fn(() => Promise.resolve({
          data: [
            { loan_id: 1, applicant_name: 'Test User' },
          ],
        })),
      }),
    },
  };
});

describe('API Service Smoke Tests', () => {
  it('should export applyLoan function', async () => {
    const { applyLoan } = await import('../src/services/api.js');
    expect(applyLoan).toBeDefined();
    expect(typeof applyLoan).toBe('function');
  });

  it('should export getLoans function', async () => {
    const { getLoans } = await import('../src/services/api.js');
    expect(getLoans).toBeDefined();
    expect(typeof getLoans).toBe('function');
  });

  it('should export getLoanDetail function', async () => {
    const { getLoanDetail } = await import('../src/services/api.js');
    expect(getLoanDetail).toBeDefined();
    expect(typeof getLoanDetail).toBe('function');
  });

  it('should return success response structure from applyLoan', async () => {
    const { applyLoan } = await import('../src/services/api.js');
    const result = await applyLoan({
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
      income: 50000,
      credit_score: 700,
      loan_amount: 10000,
    });

    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('data');
  });

  it('should generate demo applications', async () => {
    const { generateDemoApplications } = await import('../src/services/api.js');
    const apps = generateDemoApplications(5);

    expect(Array.isArray(apps)).toBe(true);
    expect(apps.length).toBe(5);
    expect(apps[0]).toHaveProperty('name');
    expect(apps[0]).toHaveProperty('email');
    expect(apps[0]).toHaveProperty('age');
    expect(apps[0]).toHaveProperty('income');
    expect(apps[0]).toHaveProperty('credit_score');
    expect(apps[0]).toHaveProperty('loan_amount');
  });
});

