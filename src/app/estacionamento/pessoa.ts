import { Veiculo } from "./veiculo";

export interface Pessoa {

//atributos conformes ao modelo de dados
  id: number;
  nome: string;
  numFunc: string;
  tipoVinculo: string;
  cargo: string;
  fgOuCc: string;
  lotacao: string;
  ramal: string;
  email: string;
  veiculos: Veiculo[]; // Supondo que Veiculo é uma interface definida em outro lugar

}
