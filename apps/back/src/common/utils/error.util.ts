/**
 * Extract error message from error object
 * @param error - Error object
 * @returns Error message string
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

/**
 * Extract error stack from error object
 * @param error - Error object
 * @returns Error stack string or null
 */
export const getErrorStack = (error: unknown): string | null => {
  if (error instanceof Error && error.stack) {
    return error.stack;
  }
  return null;
};

/**
 * Check if error is a known error type
 * @param error - Error object
 * @returns True if error is instance of Error
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};
