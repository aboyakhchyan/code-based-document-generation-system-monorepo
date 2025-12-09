export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};


export const getErrorStack = (error: unknown): string | null => {
  if (error instanceof Error && error.stack) {
    return error.stack;
  }
  return null;
};

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};
