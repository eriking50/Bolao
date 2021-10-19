import ApostaRodada from "../models/ApostaRodada";
import ApostaRodadasRepository from "./ApostaRodadasRepository";
import * as fs from "fs"; 
import { UsuarioFile } from "./JSONUsuariosRepository";
import { JogoFile } from "./JSONRodadasRepository";
import { Palpite } from "../models/ApostaJogo";
import UsuarioRepository from "./UsuariosRepository";
import JSONUsuariosRepository from "./JSONUsuariosRepository";
import RodadasRepository from "./RodadasRepository";
import JSONRodadasRepository from "./JSONRodadasRepository";
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
  private usuariosRepository: UsuarioRepository;
  private rodadasRepository: RodadasRepository;

  constructor() {
    this.usuariosRepository = new JSONUsuariosRepository();
    this.rodadasRepository = new JSONRodadasRepository();
  }

  // ---- Recupera todas as apostas rodadas
  public findAll(): Promise<ApostaRodada[]> {
    return Promise.all([this.usuariosRepository.findAll(), this.rodadasRepository.findAll(), readFile(APOSTA_RODADAS_FILE_PATH)])
      .then(([usuarios, rodadas, apostaRodadasContent]) => {
        const apostasRodadas: ApostaRodada[] = [];
        const apostasRodadaFile = JSON.parse(apostaRodadasContent.toString()) as ApostaRodadaFile[];
        //Para cada aposta rodada no meu arquivo eu faço instruções
        for (const apostaRodadaFile of apostasRodadaFile) {
          //Procura o usuario atual no banco de dados de usuarios
          const usuarioAposta = usuarios.find(usuario => usuario.getEmail() === apostaRodadaFile.usuario.email);
          const apostaRodada = new ApostaRodada(usuarioAposta, apostaRodadaFile.pontuacaoRodada, apostaRodadaFile.numeroRodada);
          //Pega os jogos do banco de dados de rodadas
          const jogos = rodadas[apostaRodadaFile.numeroRodada - 1].getJogos();
          // Itera sobre os Jogos compara o Id das Apostas de jogos do banco de dados e gera um palpite jogo
          for (const jogo of jogos) {
            for (const apostaJogo of apostaRodadaFile.apostasJogos) {
              if (jogo.getId() === apostaJogo.jogo.id) {
                const palpiteJogo: Palpite = {
                  jogoId: apostaJogo.jogo.id,
                  golsMandante: apostaJogo.golsMandante,
                  golsVisitante: apostaJogo.golsVisitante
                }
                //Caso o jogo ja tenha pontos eu já adiciono no ApostaJogo, caso não, eu ignoro e adiciono apenas o palpite com o jogo e usuário
                if (apostaJogo.pontos) {
                  apostaRodada.addApostaJogo(palpiteJogo, jogo, usuarioAposta, apostaJogo.pontos);
                } else {
                  apostaRodada.addApostaJogo(palpiteJogo, jogo, usuarioAposta);
                }
              }
            }
          } 
          apostasRodadas.push(apostaRodada);
        }
        return apostasRodadas;
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
