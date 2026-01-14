import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = localStorage.getItem('authToken'); // Get token from local storage 
        const isLoginRoute = request.url.includes('/login'); // Check for login route      
        if (token  && !isLoginRoute) {
            // Clone the request and add the Authorization header
            const authRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Pass the cloned request to the next handler
            return next.handle(authRequest);
        }

        // If no token, pass the original request
        return next.handle(request);
    }
}