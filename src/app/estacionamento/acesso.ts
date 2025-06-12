import { Veiculo } from "./veiculo";

export interface Acesso {
  id?:number;
  entrada: Date;
  saida: Date;
  ativo: boolean;
  observacao: string;
  veiculo: Veiculo;
}
