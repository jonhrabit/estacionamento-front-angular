import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { UsuariosListaComponent } from './auth/usuarios-lista/usuarios-lista.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'usuarios',
    component: UsuariosListaComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
