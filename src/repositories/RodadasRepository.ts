import Rodada from "../models/Rodada";

export type FindAllCallback = (error: Error | null, rodadas: Rodada[]) => void;
export type SaveCallback = (error: Error | null) => void;

export default interface RodadasRepository {
  findAll(): Promise<Rodada[]>;
  findByNumeroRodada(numeroRodada: number): Promise<Rodada>;
  save(rodadas: Rodada[]): Promise<void>;
}
