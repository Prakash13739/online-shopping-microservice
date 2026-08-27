/**
 * Formats numbers into Indian Rupee (INR) currency format
 * e.g., 1499 -> ₹1,499.00
 */
export const formatINR = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatPrice = formatINR;
export default formatINR;
