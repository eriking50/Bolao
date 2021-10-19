import Rodada from "../models/Rodada";
import { TimeFile } from "./JSONTimesRepository";
import RodadasRepository from "./RodadasRepository";
import TimesRepository from "./TimesRepository";
import JSONTimesRepository from "./JSONTimesRepository";
import Jogo from "../models/Jogo";
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
  private timesRepository: TimesRepository;

  constructor () {
    this.timesRepository = new JSONTimesRepository();
  }

  // ---- Recupera todas as rodadas
  public findAll(): Promise<Rodada[]> {
    const rodadas: Rodada[] = [];
    return Promise.all([this.timesRepository.findAll(), readFile(RODADAS_FILE_PATH)])
      .then(([times, rodadaFile]) => {
        const rodadasFile = JSON.parse(rodadaFile.toString()) as RodadaFile[];
        for (const rodadaFile of rodadasFile) {
          const rodada = new Rodada(rodadaFile.numeroRodada);
          for (const jogo of rodadaFile.jogos) {
            const mandante = times.find(
              (time) => time.getId() === jogo.timeMandante.id
            );
            const visitante = times.find(
              (time) => time.getId() === jogo.timeVisitante.id
            );
            if (jogo.golsMandante && jogo.golsVisitante) {
              rodada.addJogo(new Jogo(mandante, visitante, jogo.horarioJogo, jogo.id, jogo.golsMandante, jogo.golsVisitante));
            } else {
              rodada.addJogo(new Jogo(mandante, visitante, jogo.horarioJogo, jogo.id));
            }
          }
          rodadas.push(rodada);
        }
        return rodadas;
      })
  }

  // ---- Recupera uma rodada pelo seu numero
  public async findByNumeroRodada(numeroRodada: number): Promise<Rodada> {
    try {
      const rodadas = await this.findAll();
      for (const rodada of rodadas) {
        if (rodada.getNumeroRodada() === numeroRodada) {
          return rodada;
        }
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
