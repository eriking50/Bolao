import Jogo from "./Jogo";

export default class Rodada {
  protected numeroRodada: number;
  protected horarioLimite: Date;
  protected jogos: Jogo[];

  public constructor(numeroRodada: number) {
    this.numeroRodada = numeroRodada;
    this.jogos = [];
    //Inicio a rodada com uma data que sempre será maior do que o horario dos jogos
    this.horarioLimite = new Date(new Date().getFullYear() + 1, 11, 31);
  }

  public addJogo(jogo: Jogo): void {
    this.jogos.push(jogo);
    this.atualizarHorarioLimite(jogo);
  }

  public getJogos(): Jogo[] {
    return this.jogos;
  }

  private atualizarHorarioLimite(novoJogo: Jogo): void {
    if (this.horarioLimite > novoJogo.getHorarioJogo()) {
      this.horarioLimite = novoJogo.getHorarioJogo();
    }
  }

  public getNumeroRodada(): number {
    return this.numeroRodada;
  }

  public getJogoById(jogoId: number): Jogo {
    const jogo = this.jogos.find(jogo => {
      return jogo.getId() === jogoId;
    })

    if (jogo) {
      return jogo;
    }

    throw new Error("Jogo Não Encontrado");
  }

  public getHorarioLimiteAposta(): Date {
    return this.horarioLimite;
  }
}
