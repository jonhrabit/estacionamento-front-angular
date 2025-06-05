import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environment';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {

  const token = inject(AuthService).getToken();

  if (!token) {
    return next(req.clone({url: environment.apiUrl + "/" + req.url}));
  }

  const reqClone = req.clone({
    setHeaders: {
      'Content-Type': 'application/json', // Example
      "Authorization": `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*', // Example: Allow all origins
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    url: environment.apiUrl + "/" + req.url, // Prepend the base URL from environment
  });

  return next(reqClone);

};
