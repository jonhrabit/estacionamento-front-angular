import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { UsuariosListaComponent } from './auth/usuarios-lista/usuarios-lista.component';
import { AuthGuard } from './auth/auth.guard';
import { PessoasComponent } from './estacionamento/pessoas/pessoas.component';
import { VeiculosComponent } from './estacionamento/veiculos/veiculos.component';
import { AcessosComponent } from './estacionamento/acessos/acessos.component';
import { FeedBloqueioComponent } from './auth/feed-bloqueio.component';
import { AcessosRelatorioComponent } from './estacionamento/acessos/acessos-relatorio/acessos-relatorio.component';
import { AcessosRelatorioPrintComponent } from './estacionamento/acessos/acessos-relatorio/acessos-relatorio-print.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'pessoas', component: PessoasComponent, canActivate: [AuthGuard] },
  { path: 'veiculos', component: VeiculosComponent, canActivate: [AuthGuard] },
  { path: 'acessos', component: AcessosComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/acessos', component: AcessosRelatorioComponent, canActivate: [AuthGuard] },
  { path: 'acessos-relatorio-print', component: AcessosRelatorioPrintComponent, canActivate: [AuthGuard] },
  {
    path: 'usuarios',
    component: UsuariosListaComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: '403', component: FeedBloqueioComponent },
];
