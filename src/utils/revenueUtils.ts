export const calculateRevenueFromUsers = (
  users: number,
  conversionRate: number = 0.05,
  arpu: number = 1,
): number => {
  return Math.floor(users * conversionRate * arpu);
};

export const getRevenueIncrease = (
  currentUsers: number,
  newUsers: number,
  conversionRate: number = 0.05,
  arpu: number = 1,
): number => {
  const currentRevenue = calculateRevenueFromUsers(currentUsers, conversionRate, arpu);
  const newRevenue = calculateRevenueFromUsers(newUsers, conversionRate, arpu);
  return newRevenue - currentRevenue;
};
