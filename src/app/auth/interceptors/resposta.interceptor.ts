import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
export const RespostaInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Redirecionar para a página de login se a resposta for 401
      if (error.status === 403) {
        router.navigate(['/403']);
        return throwError(() => error); // Rejeitar o erro para impedir que seja tratado pelo componente
      }
      if (error.status === 401) {
        router.navigate(['/403']);
        return throwError(() => error); // Rejeitar o erro para impedir que seja tratado pelo componente
      }
      if (error.status === 404) {
        router.navigate(['/403']);
        return throwError(() => error); // Rejeitar o erro para impedir que seja tratado pelo componente
      }
      // Outros erros podem ser tratados aqui
      return throwError(() => error); // Rejeitar o erro para impedir que seja tratado pelo componente
    })
  );

  return next(req);
};
