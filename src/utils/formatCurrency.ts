/**
 * Formats a number to Indian Rupee (₹ / INR) currency standard with Indian numbering format:
 * e.g., 34999 -> "₹34,999", 124999 -> "₹1,24,999", 194999 -> "₹1,94,999"
 */
export function formatINR(amount: number | null | undefined, includeDecimals = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Price on Request';
  
  if (includeDecimals) {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export const FREE_SHIPPING_THRESHOLD_INR = 10000; // ₹10,000 for free insured courier
export const STANDARD_SHIPPING_FEE_INR = 499; // ₹499
export const GST_RATE = 0.18; // 18% GST standard in India for electronic hardware
