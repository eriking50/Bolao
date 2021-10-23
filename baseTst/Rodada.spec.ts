import Rodada from "../src/models/Rodada";
import Time from "../src/models/Time";
import Jogo from "../src/models/Jogo";

describe("Testes da classe model: Rodada", () => {
    describe("Função que adciona um jogo ao Array de jogos", () => {
        it("O jogo retornado com o id 1 deve ter a referência igual ao jogo que foi adcionado", () => {
            const time1 = new Time("Cruzeiro");
            const time2 = new Time("Atlético");
            const rodada = new Rodada(1);
            const jogo = new Jogo(time1, time2, new Date(), 1);
            rodada.addJogo(jogo);

            expect(rodada.getJogoById(1)).toBe(jogo);
        });
    });
    describe("Função que retorna os jogos de uma rodada", () => {
        it("O tamanho do array retornado deve retornar 5", () => {
            const time1 = new Time("Cruzeiro");
            const time2 = new Time("Atlético");
            const rodada = new Rodada(1);
            const jogo = new Jogo(time1, time2, new Date(), 1);
            rodada.addJogo(jogo);
            rodada.addJogo(jogo);
            rodada.addJogo(jogo);
            rodada.addJogo(jogo);
            rodada.addJogo(jogo);

            expect(rodada.getJogos().length).toBe(5);
        });
    });
    describe("Função que retorna o número da rodada", () => {
        it("Deve retornar 1 quando a função for chamada", () => {
            const rodada = new Rodada(1);

            expect(rodada.getNumeroRodada()).toBe(1);
        });
    });
    describe("Função que adciona um jogo ao Array de jogos", () => {
        it("O jogo retornado com o id 1 deve ter a referência igual ao jogo que foi adcionado", () => {
            const time1 = new Time("Cruzeiro");
            const time2 = new Time("Atlético");
            const rodada = new Rodada(1);
            const jogo = new Jogo(time1, time2, new Date(), 1);
            rodada.addJogo(jogo);

            expect(rodada.getJogoById(1)).toBe(jogo);
        });
    });

    describe("Função que retorna um jogo pelo seu Id", () => {
        it("O jogo retornado com o id 1 deve ter a referência igual ao jogo que foi adcionado", () => {
            const time1 = new Time("Cruzeiro");
            const time2 = new Time("Atlético");
            const rodada = new Rodada(1);
            const jogo = new Jogo(time1, time2, new Date(), 1);
            rodada.addJogo(jogo);

            expect(rodada.getJogoById(1)).toBe(jogo);
        });
        it("Deve retornar um erro dizendo que o jogo não foi encontrado", () => {
            const time1 = new Time("Cruzeiro");
            const time2 = new Time("Atlético");
            const rodada = new Rodada(1);
            const jogo = new Jogo(time1, time2, new Date(), 1);
            rodada.addJogo(jogo);

            const lancaErro = () => {
                rodada.getJogoById(2)
            }

            expect(lancaErro).toThrow(new Error ("Jogo Não Encontrado"));
        });
    });

    describe("Função que retorna o horário limite de apostas", () => {
        it("Deve retornar que a data do jogo é dia 14 de maio de 2021", () => {
            const time1 = new Time("Cruzeiro");
            const time2 = new Time("Atlético");
            const rodada = new Rodada(1);
            const dataDoJogo = new Date(2021, 4, 14);
            const jogo = new Jogo(time1, time2, dataDoJogo, 1);
            rodada.addJogo(jogo);

            expect(rodada.getHorarioLimiteAposta().toISOString()).toBe(dataDoJogo.toISOString());
        })
    })
});