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
    
    // Check for CustomErrorResponse format (from GlobalExceptionHandler)
    if (err?.message && typeof err.message === 'string') {
      return err.message;
    }
    
    // Check for message in various locations (Spring Boot error response format)
    if (err?.body?.message) {
      return err.body.message;
    }
    if (err?.body?.error && typeof err.body.error === 'string') {
      // Sometimes the error message is in body.error
      return err.body.error;
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
    
    // Check for Spring Security error format
    if (err?.status === 403 || err?.status === 401) {
      if (err?.message) {
        return err.message;
      }
      if (err?.error) {
        return err.error;
      }
    }
  }

  // Check HTTP status and provide context
  if (error?.status === 403) {
    return 'Access Denied: You do not have permission to perform this action.';
  }
  if (error?.status === 401) {
    return 'Unauthorized: Please log in again.';
  }
  if (error?.status === 404) {
    return 'Resource not found.';
  }
  if (error?.status === 500) {
    return 'Server error occurred. Please try again later.';
  }

  // Check top-level message
  if (error?.message) {
    return error.message;
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
}
