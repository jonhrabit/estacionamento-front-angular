import { Veiculo } from "./veiculo";

export interface Acesso {
  id:number;
  veiculo: Veiculo;
  entrada: Date;
  saida: Date;
  ativo: boolean;
  observacao: string;

}
