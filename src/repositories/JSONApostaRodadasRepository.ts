import ApostaRodada from "../models/ApostaRodada";
import ApostaRodadasRepository from "./ApostaRodadasRepository";
import * as fs from "fs"; 
import { UsuarioFile } from "./JSONUsuariosRepository";
import { JogoFile, RodadaFile } from "./JSONRodadasRepository";
import { Palpite } from "../models/ApostaJogo";
import UsuarioRepository from "./UsuariosRepository";
import JSONUsuariosRepository from "./JSONUsuariosRepository";
import RodadasRepository from "./RodadasRepository";
import JSONRodadasRepository from "./JSONRodadasRepository";
import Usuario from "../models/Usuario";
import Rodada from "../models/Rodada";
import Jogo from "../models/Jogo";
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
  usuario: UsuarioFile
  apostasJogos: ApostaJogoFile[],
  pontuacaoRodada: number
};

export default class JSONApostaRodadasRepository implements ApostaRodadasRepository {
  private usuariosRepository: UsuarioRepository;
  private rodadasRepository: RodadasRepository;

  constructor() {
    this.usuariosRepository = new JSONUsuariosRepository();
    this.rodadasRepository = new JSONRodadasRepository();
  }

  // ---- Recupera todas as apostas rodadas
  public async findAll(): Promise<ApostaRodada[]> {
    const [usuarios, rodadas, apostaRodadasContent] = await Promise.all([this.usuariosRepository.findAll(), this.rodadasRepository.findAll(), readFile(APOSTA_RODADAS_FILE_PATH)]);
    const apostasRodadaFile = JSON.parse(apostaRodadasContent.toString()) as ApostaRodadaFile[];
    return this.gerarApostasRodada(apostasRodadaFile, usuarios, rodadas);
  }

  private gerarApostasRodada(apostasRodadaFile: ApostaRodadaFile[], usuarios: Usuario[], rodadas: Rodada[] ) {
    return apostasRodadaFile.map(apostaRodadaFile => {
      const usuarioAposta = usuarios.find(usuario => usuario.getEmail() === apostaRodadaFile.usuario.email);
      const jogos = rodadas[apostaRodadaFile.numeroRodada - 1].getJogos();
      return this.gerarApostasJogosDaRodada(jogos, apostaRodadaFile.apostasJogos, usuarioAposta, apostaRodadaFile.pontuacaoRodada, apostaRodadaFile.numeroRodada);
    })
  }

  private gerarApostasJogosDaRodada(jogos: Jogo[], apostasJogos: ApostaJogoFile[], usuario: Usuario, pontuacaoRodada: number, numeroRodada: number): ApostaRodada {
    const apostaRodada = new ApostaRodada(usuario, pontuacaoRodada, numeroRodada);
    jogos.map((jogo) => {
      apostasJogos.map((apostaJogo) => {
        if (jogo.getId() === apostaJogo.jogo.id) {
          const palpiteJogo: Palpite = {
            jogoId: apostaJogo.jogo.id,
            golsMandante: apostaJogo.golsMandante,
            golsVisitante: apostaJogo.golsVisitante
          }
          if (apostaJogo.pontos) {
            apostaRodada.addApostaJogo(palpiteJogo, jogo, usuario, apostaJogo.pontos);
          } else {
            apostaRodada.addApostaJogo(palpiteJogo, jogo, usuario);
          }
        }
      });
    });
    return apostaRodada;
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
