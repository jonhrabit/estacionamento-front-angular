import { Permissao } from "./permissao";

export interface Usuario {
  id: number;
  nome: string;
  username: string;
  password: string;
  email: string;
  cpf: string;
  cadastro: Date;
  permissoes: Permissao[];

}
