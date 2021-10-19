import Jogo from "./Jogo";
import Rodada from "./Rodada";
import Time from "./Time";

export default abstract class Calendario {
  public static geraCalendarioCampeonato(
    times: Time[],
    dataPrimeiroJogo: Date,
    turnos = 2
  ): Rodada[] {
    // @todo Gerar um calendário de pontos corridos com ida e volta.
    // jogos serão nas quartas as 21:30 e nos domingos as 16:00.
    // Primeiro jogo será conforme o parametro

    let quantidadeDeTimesArray: number;
    //O total de rodadas é gerado considerando: Multiplica os turnos pela quantidade de times menos 1
    let totalRodadas = (times.length - 1) * turnos;

    //Em caso de time Ímpar adiciona 1 ao valor da quantidadeDeTimesArray depois divide por 2, senão, apenas divide por 2
    if (times.length % 2 !== 0) {
      quantidadeDeTimesArray = (times.length + 1) / 2;
    } else {
      quantidadeDeTimesArray = times.length / 2;
    }

    //Gera os potes com IDs dos times considerando a quantidadeDeTimesArray
    const poteIdTimes1: number[] = []
    for (let i = 0; i < quantidadeDeTimesArray; i++) {
      poteIdTimes1.push(i+1);
    }
    //No pote 2 o valor inicial é a quantidadeDeTimesArray
    const poteIdTimes2: number[] = []
    for (let i = quantidadeDeTimesArray; i < quantidadeDeTimesArray * 2; i++) {
      poteIdTimes2.push(i+1);
    }

    const rodadas: Rodada[] = [];
    const dataAtual: Date = new Date(dataPrimeiroJogo);
    for (let i = 1; i <= totalRodadas; i++) {
      const rodada = new Rodada(i);
      if (i % 2 === 0) {
        //Caso rodada Par seleciona os ids do pote 1 como mandante e os do pote 2 como visitante
        for (let j = 0; j < quantidadeDeTimesArray; j++) {
          const mandante: Time = times.find(
            (time) => time.getId() === poteIdTimes1[j]
          );
          const visitante: Time = times.find(
            (time) => time.getId() === poteIdTimes2[j]
          );
          if (!mandante || !visitante) {
            
          } else {
            const jogo = new Jogo(mandante, visitante, dataAtual);
            rodada.addJogo(jogo);
          }
        }
      } else {
        //Caso rodada Ímpar seleciona os ids do pote 2 como mandante e os do pote 1 como visitante
        for (let j = 0; j < poteIdTimes1.length; j++) {
          const visitante: Time = times.find(
            (time) => time.getId() === poteIdTimes1[j]
          );
          const mandante: Time = times.find(
            (time) => time.getId() === poteIdTimes2[j]
          );
          if (!mandante || !visitante) {
            
          } else {
            const jogo = new Jogo(mandante, visitante, dataAtual);
            rodada.addJogo(jogo);
          }
        }
      }
      //Retira o ultimo elemento do pote 1 e retorna ele
      const valorIdPote1: number = poteIdTimes1.pop();
      //Retira o primeiro elemento do porte 2 e retorna ele
      const valorIdPote2: number = poteIdTimes2.shift();
      //Adciona na ultima posição o elemento extraido do pote 1
      poteIdTimes2.push(valorIdPote1);
      //Adciona na segunda posição o elemento extraido do pote 2
      poteIdTimes1.splice(1, 0, valorIdPote2);
      rodadas.push(rodada);
      //Se for domingo ele vai setar +3 dias e setar a hora pra 21h30
      if (dataAtual.getDay() === 0) {
        dataAtual.setDate(dataAtual.getDate() + 3);
        dataAtual.setHours(21, 30);
        //Se for quarta feira setar +4 dias e setar a hora pra 16h
      } else if (dataAtual.getDay() === 3) {
        dataAtual.setDate(dataAtual.getDate() + 4);
        dataAtual.setHours(16, 0);
      }
    }
    return rodadas;
  }
}
