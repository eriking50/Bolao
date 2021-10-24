import Jogo from "./Jogo";
import Resultado from "./Resultado";
import Usuario from "./Usuario";

export type Palpite = {
  jogoId: number;
  golsMandante: number;
  golsVisitante: number;
};

export default class ApostaJogo {
  protected readonly usuario: Usuario;
  protected readonly jogo: Jogo;
  protected readonly golsMandante: number;
  protected readonly golsVisitante: number;
  protected pontos?: number;

  public constructor(golsMandante: number, golsVisitante: number, jogo: Jogo, usuario: Usuario, pontos?: number) {
    this.usuario = usuario;
    this.jogo = jogo;
    this.golsMandante = golsMandante;
    this.golsVisitante = golsVisitante;
    if (pontos) {
      this.pontos = pontos;
    }
  }

  public getUsuario(): Usuario {
    return this.usuario;
  }

  public getJogo(): Jogo {
    return this.jogo;
  }

  public getGolsMandante(): number {
    return this.golsMandante;
  }

  public getGolsVisitante(): number {
    return this.golsVisitante;
  }

  public getPontos(): number {
    if (this.pontos) {
      return this.pontos;
    }
    return 0;
  }

  /**
   * Compara a aposta do usuário com o resultado do jogo e
   * atualiza a quantidade de pontos feitos.
   * @return Valor dos pontos feitos pelo usuário na aposta do jogo associado.
   */
  public atualizaPontuacao(): number {
    let pontuacaoAtual = 0;
    if (this.jogo.getGolsVisitante() === this.golsVisitante) {
      pontuacaoAtual += 3;
    }
    if (this.jogo.getGolsMandante() === this.golsMandante) {
      pontuacaoAtual += 3;
    }
    if (
      Resultado.gerarResultado(
        this.jogo.getGolsMandante(),
        this.jogo.getGolsVisitante()
      ) === Resultado.gerarResultado(this.golsMandante, this.golsVisitante)
    ) {
      pontuacaoAtual += 6;
    }
    this.pontos = pontuacaoAtual;
    return this.pontos;
  }
}
