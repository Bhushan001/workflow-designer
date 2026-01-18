import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const currentUser = authService.getCurrentUser();

  const headers: { [key: string]: string } = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add X-User-Id header for workflow API calls
  if (currentUser?.id && req.url.includes('/workflows')) {
    headers['X-User-Id'] = currentUser.id;
  }

  if (Object.keys(headers).length > 0) {
    const clonedReq = req.clone({
      setHeaders: headers
    });
    return next(clonedReq);
  }

  return next(req);
};
