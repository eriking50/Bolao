export default abstract class Resultado {
  static gerarResultado(golsMandante: number, golsVisitante: number): string {
    if (golsMandante > golsVisitante) {
      return "Mandante";
    } else if (golsMandante < golsVisitante) {
      return "Visitante";
    } else {
      return "Empate";
    }
  }
}
