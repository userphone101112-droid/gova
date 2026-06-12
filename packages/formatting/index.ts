// @gv/formatting

export function formatCurrency(
  amount: number,
  locale: string = 'en',
  currency: string = 'USD'
): string {
  try {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount} ${currency}`;
  }
}

export function formatDate(
  date: Date | string | number,
  locale: string = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  try {
    const parsedDate = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', options).format(parsedDate);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

export function formatNumber(
  num: number,
  locale: string = 'en',
  options?: Intl.NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', options).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(num);
  }
}

export function formatPercentage(
  value: number, // e.g. 0.15 for 15%
  locale: string = 'en',
  decimals: number = 0
): string {
  try {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${(value * 100).toFixed(decimals)}%`;
  }
}
