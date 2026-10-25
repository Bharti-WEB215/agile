import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateCartTotal, getStatusColor, getPaymentModeColor } from '../services/utils';
import type { CartItem } from '../services/types';

describe('formatCurrency', () => {
  it('formats a number as INR currency', () => {
    expect(formatCurrency(100)).toBe('₹100.00');
  });

  it('formats decimal values correctly', () => {
    expect(formatCurrency(99.5)).toBe('₹99.50');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
  });

  it('handles string input', () => {
    expect(formatCurrency('250.75')).toBe('₹250.75');
  });
});

describe('calculateCartTotal', () => {
  it('returns 0 for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it('calculates total for single item', () => {
    const cart: CartItem[] = [
      { productId: 1, name: 'Chai', price: 30, quantity: 2 },
    ];
    expect(calculateCartTotal(cart)).toBe(60);
  });

  it('calculates total for multiple items', () => {
    const cart: CartItem[] = [
      { productId: 1, name: 'Chai', price: 30, quantity: 2 },
      { productId: 2, name: 'Samosa', price: 20, quantity: 3 },
    ];
    expect(calculateCartTotal(cart)).toBe(120);
  });
});

describe('getStatusColor', () => {
  it('returns correct color for PENDING', () => {
    const result = getStatusColor('PENDING');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('returns correct color for COMPLETED', () => {
    const result = getStatusColor('COMPLETED');
    expect(result).toBeTruthy();
  });

  it('returns a cancellation color for CANCELLED orders', () => {
    expect(getStatusColor('CANCELLED')).toContain('red');
  });

  it('returns a default for unknown status', () => {
    const result = getStatusColor('UNKNOWN');
    expect(result).toBeTruthy();
  });
});

describe('getPaymentModeColor', () => {
  it('returns correct color for CASH', () => {
    const result = getPaymentModeColor('CASH');
    expect(result).toBeTruthy();
  });

  it('returns correct color for UPI', () => {
    const result = getPaymentModeColor('UPI');
    expect(result).toBeTruthy();
  });
});
