/**
 * Format date to ISO string
 * @param date - Date to format
 * @returns ISO string
 */
export const formatDateISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Format date to readable string
 * @param date - Date to format
 * @param locale - Locale (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (date: Date, locale: string = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Get date N days from now
 * @param days - Number of days to add
 * @returns Date object
 */
export const addDays = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Get date N hours from now
 * @param hours - Number of hours to add
 * @returns Date object
 */
export const addHours = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

/**
 * Check if date is expired
 * @param date - Date to check
 * @returns True if date is in the past
 */
export const isExpired = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Get time difference in milliseconds
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in milliseconds
 */
export const getTimeDifference = (date1: Date, date2: Date): number => {
  return Math.abs(date1.getTime() - date2.getTime());
};
