import Usuario from "./Usuario";
import ApostaJogo, { Palpite } from "./ApostaJogo";
import Jogo from "./Jogo";

export default class ApostaRodada {
  private static rodadaAtual = 1;
  protected readonly numeroRodada: number;
  protected readonly usuario: Usuario;
  protected readonly apostasJogos: ApostaJogo[];
  protected pontuacaoRodada: number;

  public constructor(usuario: Usuario, pontuacaoRodada?: number, numeroRodada?: number) {
    if (numeroRodada) {
      this.numeroRodada = numeroRodada;
      ApostaRodada.rodadaAtual = ++numeroRodada;
    } else {
      this.numeroRodada = ApostaRodada.rodadaAtual;
      ApostaRodada.rodadaAtual++;
    }
    this.usuario = usuario;
    this.apostasJogos = [];
    if (pontuacaoRodada) {
      this.pontuacaoRodada = pontuacaoRodada;
    } else { 
      this.pontuacaoRodada = 0;
    }
  }

  public addApostaJogo(palpite: Palpite, jogo: Jogo, usuario: Usuario, pontos?: number): void {
    this.apostasJogos.push(new ApostaJogo(palpite.golsMandante, palpite.golsVisitante, jogo, usuario, pontos));
  }

  public getUsuario(): Usuario {
    return this.usuario;
  }

  public getNumeroRodada(): number {
    return this.numeroRodada;
  }

  public getApostasJogos(): ApostaJogo[] {
    return this.apostasJogos;
  }

  public atualizaPontuacao(): number {
    let pontos = 0;
    this.apostasJogos.forEach((apostaJogo) => {
      pontos += apostaJogo.getPontos();
    });
    this.pontuacaoRodada = pontos;
    return pontos;
  }
}
