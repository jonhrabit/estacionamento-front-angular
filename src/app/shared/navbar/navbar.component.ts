import { AuthService } from '../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlterarSenhaComponent } from '../../auth/alterar-senha/alterar-senha.component';
import { UsuarioLogadoService } from '../../auth/usuario-logado.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [NgbDropdownModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  nomeUsuario = 'Entrar';
  private usuarioSub: any;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private usuarioLogadoService: UsuarioLogadoService
  ) {}

  ngOnInit() {
    this.nomeUsuario = this.authService.getUsuarioLogado()?.sub || 'Entrar';
    this.usuarioSub = this.usuarioLogadoService.usuario$.subscribe(usuario => {
      if (usuario && usuario.sub) {
        this.nomeUsuario = usuario.sub;
      }
    });
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
}
