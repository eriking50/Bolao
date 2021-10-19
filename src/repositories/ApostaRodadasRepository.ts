import ApostaRodada from "../models/ApostaRodada";

export default interface ApostaRodadasRepository {
  findByNumeroRodadaEUsuario(numeroRodada: number, emailUsuario: string): Promise<ApostaRodada>;
  findByNumeroRodada(numeroRodada: number): Promise<ApostaRodada[]>;
  findByUsuario(emailUsuario: string): Promise<ApostaRodada[]>;
  save(apostaRodada: ApostaRodada): Promise<void>;
}
