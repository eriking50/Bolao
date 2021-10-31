import Time from "../models/Time";
import TimesRepository from "./TimesRepository";
import * as fs from "fs";
const { readFile, writeFile } = fs.promises;

const TIMES_FILE_PATH = "./files/times.json";

export type TimeFile = {
  id: number;
  nome: string;
  estado: string;
};

export default class JSONTimesRepository implements TimesRepository {

  private timesFilePath: string;

  constructor(outrosTimes?: string) {
    this.timesFilePath = outrosTimes || TIMES_FILE_PATH;
  }

  // --- Recupera todos
  public async findAll(): Promise<Time[]> {
    try {
      const fileContent = await readFile(this.timesFilePath);
      const timesSemClasse = JSON.parse(fileContent.toString()) as TimeFile[];
      return timesSemClasse.map(({ id, nome }) => new Time(nome, id));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Falha a carregar os times. Motivo: ${error.message}.`);
      } else {
        throw error;
      }
    }
  }

  // --- Recupera um pelo seu id
  public async findById(id: number): Promise<Time> {
    try {
      const times = await this.findAll();
      const time = times.find(time => time.getId() === id);
      
      if (time) {
        return time;
      }

      throw new Error("Time não encontrado.");
    } catch (error) {
      throw new Error(`Falha ao encontrar o time. Motivo: ${error.message}.`);
    }
  }

  // --- Atualiza um time
  public async update(time: Time): Promise<void> {
    try {
      const timesPromise = await this.findAll();
      
      const timeIndice = timesPromise.findIndex(timePromise => {
        if (timePromise.getId() === time.getId()) {
          return true;
        }
      });

      if (timeIndice >= 0) {
        timesPromise.splice(timeIndice, 1, time)
        return await this.save(timesPromise);
      }

      throw new Error("Time não encontrado.");
    } catch (error) {
      throw new Error(`Falha ao atualizar o time. Motivo: ${error.message}.`);
    }
  }

  // --- Salva um time
  public async save(times: Time[]): Promise<void> {
    try {
      return writeFile(this.timesFilePath, JSON.stringify(times, null, 2));
    } catch (erro) {
      throw new Error(`Falha ao salvar os times. Motivo: ${erro.message}.`);
    }
  }

}
