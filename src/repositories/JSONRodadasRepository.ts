import Rodada from "../models/Rodada";
import { TimeFile } from "./JSONTimesRepository";
import RodadasRepository from "./RodadasRepository";
import Jogo from "../models/Jogo";
import Time from "../models/Time";
import * as fs from "fs"; 
const { readFile, writeFile } = fs.promises;

const RODADAS_FILE_PATH = "./files/rodadas.json";

export type JogoFile = {
  timeMandante: TimeFile;
  timeVisitante: TimeFile;
  horarioJogo: Date;
  id: number;
  golsMandante?: number,
  golsVisitante?: number,
};

export type RodadaFile = {
  numeroRodada: number;
  jogos: JogoFile[];
  horarioLimite: Date;
};

export default class JSONRodadasRepository implements RodadasRepository {

  // ---- Recupera todas as rodadas
  public async findAll(): Promise<Rodada[]> {
    const rodadaFile = await readFile(RODADAS_FILE_PATH);
    const rodadasFile = JSON.parse(rodadaFile.toString()) as RodadaFile[];
    return rodadasFile.map(rodadaFile => {
      const rodada = new Rodada(rodadaFile.numeroRodada);
      rodadaFile.jogos.forEach(({id, horarioJogo, timeMandante, timeVisitante, golsMandante, golsVisitante}) => {
        const mandante = new Time(timeMandante.nome, timeMandante.id);
        const visitante = new Time(timeVisitante.nome, timeVisitante.id);
        rodada.addJogo(new Jogo(mandante, visitante, horarioJogo, id, golsMandante, golsVisitante));
      })
      return rodada;
    });
  }

  // ---- Recupera uma rodada pelo seu numero
  public async findByNumeroRodada(numeroRodada: number): Promise<Rodada> {
    try {
      const rodadas = await this.findAll();
      const rodada = rodadas.find(rodada => rodada.getNumeroRodada() === numeroRodada);
      
      if (rodada) {
        return rodada;
      }

      throw new Error("Essa Rodada Não Existe.");
    } catch (error) {
      throw new Error(`Falha ao encontrar as Rodadas. Motivo: ${error.message}.`);
    }
    
  }

  // ---- Salva uma lista de rodadas
  public async save(rodadas: Rodada[]): Promise<void> {
    try {
      return writeFile(RODADAS_FILE_PATH, JSON.stringify(rodadas, null, 2));
    } catch (erro) {
      throw new Error(`Falha ao salvar as Rodadas. Motivo: ${erro.message}.`);
    }
  }

}
