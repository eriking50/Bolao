import Time from "../models/Time";
import TimesRepository from "./TimesRepository";
import * as fs from "fs";
const { readFile, writeFile } = fs.promises;

const TIMES_FILE_PATH = "./files/times.json";

export type TimeFile = {
  id: number;
  nome: string;
};

export default class JSONTimesRepository implements TimesRepository {

  private timesFilePath: string;

  constructor(outrosTimes?: string) {
    this.timesFilePath = outrosTimes || TIMES_FILE_PATH;
  }

  // --- Recupera todos
  public findAll(): Promise<Time[]> {
    return readFile(this.timesFilePath)
        .then((fileContent: Buffer) => {
            const timesSemClasse  = JSON.parse(fileContent.toString()) as TimeFile[];
            return timesSemClasse.map(
              ({ nome, id }) => new Time(nome, id)
            );
        })
        .catch((error: any) => {
          if(error instanceof Error) {
            throw new Error(`Falha a carregar os times. Motivo: ${error.message}.`);
          } else {
            throw error
          }
        });
  }

  // --- Recupera um pelo seu id
  public async findById(id: number): Promise<Time> {
    try {
      const times = await this.findAll();
      for (const time of times) {
        if (time.getId() === id) {
          return time;
        }
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
      for (let i = 0; i < timesPromise.length; i++) {
        if (timesPromise[i].getId() === time.getId()) {
          timesPromise[i] = time;
          await this.save(timesPromise);
          return;
        }
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
