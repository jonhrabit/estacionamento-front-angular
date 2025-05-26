import { Usuario } from '../usuario';
import { UsuarioService } from './../usuario.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios-lista',
  imports: [CommonModule],
  templateUrl: './usuarios-lista.component.html',
  styleUrl: './usuarios-lista.component.scss',
})
export class UsuariosListaComponent implements OnInit {
  private usuarios: Usuario[] = [];
  usuariosFiltradas: Usuario[] = [];

  // paginação
  page: number = 1;
  pageSize: number = 5;

  // filtro
  filtro: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  editarUsuario(id:number, usuario: Usuario) {
    this.usuarioService.updateUsuario(id, usuario).subscribe((updatedUsuario) => {
      const index = this.usuarios.findIndex((u) => u.id === updatedUsuario.id);
      if (index !== -1) {
        this.usuarios[index] = updatedUsuario;
      }
    });
  }
  eliminarUsuario(usuario: Usuario) {
    this.usuarioService.deleteUsuario(usuario.id).subscribe(() => {
      this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
    });
  }
  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  aplicarFiltro(): void {
    const termo = this.filtro.toLowerCase().trim();
    this.usuariosFiltradas = this.usuarios.filter((p) =>
      p.nome.toLowerCase().includes(termo)
    );
    this.page = 1; // volta para primeira página após filtrar
  }
}
