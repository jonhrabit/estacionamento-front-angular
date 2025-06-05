import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { RespostaInterceptor } from './auth/interceptors/resposta.interceptor';

registerLocaleData(localePtBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideHttpClient(withInterceptors([TokenInterceptor,RespostaInterceptor])),
  ],
};
