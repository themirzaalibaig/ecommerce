import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import type { UseFormSetError } from 'react-hook-form';

interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Handle API errors and set form field errors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (error: unknown, setError?: UseFormSetError<any>) => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;

    if (apiError?.errors && Array.isArray(apiError.errors) && setError) {
      // Handle validation errors
      apiError.errors.forEach((err) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError(err.field as any, {
          type: 'manual',
          message: err.message,
        });
      });
    } else {
      // Handle general errors
      const errorMessage = apiError?.message || apiError?.error || 'An error occurred';
      toast.error(errorMessage);
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
};

export * from './utils';
