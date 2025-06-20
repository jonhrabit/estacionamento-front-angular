import { AuthService } from '../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlterarSenhaComponent } from '../../auth/alterar-senha/alterar-senha.component';
import { UsuarioLogadoService } from '../../auth/usuario-logado.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [NgbDropdownModule, RouterModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  nomeUsuario = 'Entrar';
  private scope: String | null = null;
  private usuarioSub: any;


  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private usuarioLogadoService: UsuarioLogadoService
  ) {}

  ngOnInit() {
    this.nomeUsuario = this.authService.getUsuarioLogado()?.sub || 'Entrar';
    this.scope = this.authService.getScope();
    this.usuarioSub = this.usuarioLogadoService.usuario$.subscribe(
      (usuario) => {
        if (usuario && usuario.sub) {
          this.nomeUsuario = usuario.sub;
        }
        if (usuario && usuario.scope) {
          this.scope = usuario.scope;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.usuarioSub) {
      this.usuarioSub.unsubscribe();
    }
  }

  alterarSenha() {
    this.modalService.open(AlterarSenhaComponent, { centered: true });
  }

  logout() {
    this.authService.logout();
  }

  isLogado(): boolean {
    return this.authService.isLoggedIn();
  }
  contemScope(permissao: string): boolean {
    if (!this.scope || !permissao) return false;
    return this.scope.toLowerCase().includes(permissao.toLowerCase());
  }
}
