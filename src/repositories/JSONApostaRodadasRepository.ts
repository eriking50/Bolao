import ApostaRodada from "../models/ApostaRodada";
import ApostaRodadasRepository from "./ApostaRodadasRepository";
import * as fs from "fs"; 
import { UsuarioFile } from "./JSONUsuariosRepository";
import { JogoFile} from "./JSONRodadasRepository";
import Usuario from "../models/Usuario";
import Jogo from "../models/Jogo";
import Time from "../models/Time";
const { readFile, writeFile } = fs.promises;

const APOSTA_RODADAS_FILE_PATH = "./files/aposta-rodadas.json";

type ApostaJogoFile = {
  usuario: UsuarioFile,
  jogo: JogoFile,
  golsMandante: number,
  golsVisitante: number,
  pontos?: number
}

type ApostaRodadaFile = {
  numeroRodada: number,
  usuario: UsuarioFile,
  apostasJogos: ApostaJogoFile[],
  pontuacaoRodada: number
};

export default class JSONApostaRodadasRepository implements ApostaRodadasRepository {

  // ---- Recupera todas as apostas rodadas
  public async findAll(): Promise<ApostaRodada[]> {
    const apostaRodadasContent = await readFile(APOSTA_RODADAS_FILE_PATH);
    const apostasRodadaFile = JSON.parse(apostaRodadasContent.toString()) as ApostaRodadaFile[];
    return apostasRodadaFile.map(({apostasJogos, numeroRodada, usuario, pontuacaoRodada}) => {
      const usuarioAposta = new Usuario(usuario.nome, usuario.email, usuario.senha);
      const apostasRodada = new ApostaRodada(usuarioAposta, numeroRodada, pontuacaoRodada);
      apostasJogos.forEach(({golsMandante, golsVisitante, jogo, pontos}) => {
        const mandante = new Time(jogo.timeMandante.nome, jogo.timeMandante.id);
        const visitante = new Time(jogo.timeVisitante.nome, jogo.timeVisitante.id);
        const partida = new Jogo(mandante, visitante, jogo.horarioJogo, jogo.id, jogo.golsMandante, jogo.golsVisitante);
        apostasRodada.addApostaJogo(golsMandante, golsVisitante, partida, usuarioAposta, pontos);
      })
      return apostasRodada;
    })
  }

  // ---- Recupera uma aposta rodada pelo seu numero e usuario
  public async findByNumeroRodadaEUsuario(numeroRodada: number, emailUsuario: string): Promise<ApostaRodada> {
    try {
      const apostasRodadas = await this.findAll();
      const apostaByRodadaEUsuario = apostasRodadas.find(apostaRodada => apostaRodada.getNumeroRodada() === numeroRodada && apostaRodada.getUsuario().getEmail() === emailUsuario);
      
      if (apostaByRodadaEUsuario) {
        return apostaByRodadaEUsuario;
      }
      throw new Error("Não foi possível encontrar uma Aposta de Rodada com esse email e número de rodada.");
    } catch (error) {
      throw new Error(`Erro ao fazer busca das Apostas da Rodada. Motivo ${error.message}`);
    }
  }

  // ---- Recupera apostas rodadas pelo numero de uma rodada
  public async findByNumeroRodada(numeroRodada: number): Promise<ApostaRodada[]> {
    try {
      const apostasRodadas = await this.findAll();
      const apostaByRodada = apostasRodadas.filter(apostaRodada => apostaRodada.getNumeroRodada() === numeroRodada);

      if (apostaByRodada) {
        return apostaByRodada;
      }
      throw new Error("Não foi possível encontrar Apostas para essa rodada.");
    } catch (error) {
      throw new Error(`Erro ao fazer busca das Apostas da Rodada. Motivo ${error.message}`);
    }
  }

  // ---- Recupera todas apostas rodadas de um usuario
  public async findByUsuario(emailUsuario: string): Promise<ApostaRodada[]> {
    try {
      const apostasRodadas = await this.findAll();
      const apostaByUsuario = apostasRodadas.filter(apostaRodada => apostaRodada.getUsuario().getEmail() === emailUsuario);
      
      if (apostaByUsuario) {
        return apostaByUsuario;
      }
      throw new Error("Não foi possível encontrar uma Aposta de Rodada com esse email e número de rodada.");
    } catch (error) {
      throw new Error(`Erro ao fazer busca das Apostas da Rodada. Motivo ${error.message}`);
    }
  }


  // ---- Salva uma aposta rodada
  public async save(apostaRodada: ApostaRodada): Promise<void> {
    try { 
      const apostasRodadas = await this.findAll();
      apostasRodadas.push(apostaRodada);

      return writeFile(APOSTA_RODADAS_FILE_PATH, JSON.stringify(apostasRodadas, null, 2));
    } catch(erro) {
      throw "Houve um erro ao salvar as apostas da rodada";
    }
  }

}
