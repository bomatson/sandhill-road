import { calculateRevenueFromUsers } from '../src/utils/revenueUtils';

describe('calculateRevenueFromUsers', () => {
  it('returns 50 for 1000 users with default parameters', () => {
    expect(calculateRevenueFromUsers(1000)).toBe(50);
  });
});
