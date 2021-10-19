import Time from "./Time";

export default class Jogo {
  private static idJogoAtual = 1;
  protected golsMandante?: number;
  protected golsVisitante?: number;
  protected readonly id: number;
  protected readonly timeMandante: Time;
  protected readonly timeVisitante: Time;
  protected readonly horarioJogo: Date;

  public constructor(
    mandante: Time,
    visitante: Time,
    dataHora: Date,
    id?: number,
    golsMandante?: number,
    golsVisitante?: number
  ) {
    if (golsMandante) {
      this.golsMandante = golsMandante;
    }
    if (golsVisitante) {
      this.golsVisitante = golsVisitante;
    }
    this.timeMandante = mandante;
    this.timeVisitante = visitante;
    this.horarioJogo = new Date(dataHora);
    if (id) {
      this.id = id;
      if (id > Jogo.idJogoAtual) {
        Jogo.idJogoAtual = ++id;
      }
    } else {
      this.id = Jogo.idJogoAtual;
      Jogo.idJogoAtual++;
    }
  }

  public getMandante(): Time {
    return this.timeMandante;
  }

  public getVisitante(): Time {
    return this.timeVisitante;
  }

  public getGolsMandante(): number {
    return this.golsMandante;
  }

  public getGolsVisitante(): number {
    return this.golsVisitante;
  }

  public getId(): number {
    return this.id;
  }

  public getHorarioJogo(): Date {
    return this.horarioJogo;
  }

  public atualizaResultado(golsMandante: number, golsVisitante: number): void {
    this.golsMandante = golsMandante;
    this.golsVisitante = golsVisitante;
  }
}
