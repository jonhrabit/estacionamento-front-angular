import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environment';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { UsuarioLogadoService } from '../usuario-logado.service';
import { jwtDecode } from 'jwt-decode';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const usuarioLogadoService = inject(UsuarioLogadoService);
  const token = authService.getToken();

  if (token) {
    try {
      const decoded: any = jwtDecode(token.toString());
      usuarioLogadoService.setUsuario(decoded);
    } catch (e) {
      // token inválido, não faz nada
    }
  }

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
