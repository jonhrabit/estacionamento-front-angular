import { AuthService } from './auth.service';
import { environment } from '../environment';
import { HttpInterceptorFn } from '@angular/common/http';
import { Inject } from '@angular/core';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtém o usuário logado
  //const usuario = Inject(AuthService).getUsuarioLogado();


  let apiReq = req;
  apiReq = req.clone({
    setHeaders: {
      'Access-Control-Allow-Origin': '*',
    },
    url: `${environment.apiUrl}/${req.url}`,
  });

  // 🔐 Adiciona o token, se existir
/*   if (usuario?.token) {
    apiReq = apiReq.clone({
      setHeaders: {
        Authorization: `Bearer ${usuario.token}`,
      },
    });
  } */

  // Handle the request and response
  return next(apiReq);
};
