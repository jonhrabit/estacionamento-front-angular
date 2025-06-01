import { AuthService } from '../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlterarSenhaComponent } from '../../auth/alterar-senha/alterar-senha.component'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [NgbDropdownModule],
})
export class NavbarComponent implements OnInit {
  nomeUsuario = 'Entrar';

  constructor(private modalService: NgbModal, private authService:AuthService) {}

  ngOnInit() {
    this.nomeUsuario = this.authService.getUsuarioLogado()?.sub || 'Entrar';
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
