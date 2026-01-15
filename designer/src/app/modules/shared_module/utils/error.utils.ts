/**
 * Utility function to extract error message from HTTP error responses
 * Handles various error response formats from the backend
 */
export function extractErrorMessage(error: any): string {
  // If error is already a string
  if (typeof error === 'string') {
    return error;
  }

  // Check common error response structures
  if (error?.error) {
    // Try nested error object
    const err = error.error;
    
    // Check for message in various locations
    if (err?.body?.message) {
      return err.body.message;
    }
    if (err?.message) {
      return err.message;
    }
    if (typeof err === 'string') {
      return err;
    }
    
    // Check for validation errors or exception messages
    if (err?.error) {
      return err.error;
    }
  }

  // Check top-level message
  if (error?.message) {
    return error.message;
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
}
