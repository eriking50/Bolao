import Jogo from "./Jogo";

export default class Rodada {
  protected numeroRodada: number;
  protected horarioLimite: Date;
  protected jogos: Jogo[];

  public constructor(numeroRodada: number) {
    this.numeroRodada = numeroRodada;
    this.jogos = [];
    //Inicio a rodada com uma data que sempre será maior do que o horario dos jogos
    this.horarioLimite = new Date(2021, 12, 31);
  }

  public addJogo(jogo: Jogo): void {
    this.jogos.push(jogo);
    this.atualizarHorarioLimite(jogo);
  }

  public getJogos(): Jogo[] {
    return this.jogos;
  }

  public atualizarHorarioLimite(novoJogo: Jogo): void {
    if (this.horarioLimite > novoJogo.getHorarioJogo()) {
      this.horarioLimite = novoJogo.getHorarioJogo();
    }
  }

  public getNumeroRodada(): number {
    return this.numeroRodada;
  }

  public getJogoById(jogoId: number): Jogo {
    this.jogos.forEach((jogo) => {
      if (jogo.getId() === jogoId) {
        return jogo;
      }
    });
    throw new Error("Jogo Não Encontrado");
  }

  /**
   * O horário de limite aposta de uma rodada é determinado pelo horário do jogo que ocorrer mais cedo.
   */
  public getHorarioLimiteAposta(): Date {
    return this.horarioLimite;
  }
}
