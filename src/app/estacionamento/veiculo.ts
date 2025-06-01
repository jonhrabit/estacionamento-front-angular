import { Pessoa } from "./pessoa";

export interface Veiculo {

  //atributos conforme o modelo de dados
  id: number;
  placa: string;
  modelo: string;
  cor: string;
  foto: string;
  temporario: boolean;
  dataLimite: Date;
  pessoa: Pessoa; // Supondo que Pessoa é uma interface definida em outro lugar
  // Métodos adicionais podem ser definidos aqui, se necessário

}
