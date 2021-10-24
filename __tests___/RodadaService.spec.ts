import RodadaService from "../src/services/RodadaService";
import JSONRodadasRepository from "../src/repositories/JSONRodadasRepository";
import BrasileiraoClient, { RodadaResponse } from "../src/clients/BrasileiraoClient";
import Time from "../src/models/Time";
import Rodada from "../src/models/Rodada";
import Jogo from "../src/models/Jogo";

const rodada: RodadaResponse = {
        "nome": "1ª Rodada",
        "slug": "1a-rodada",
        "rodada": 1,
        "status": "encerrada",
        "proxima_rodada": {
            "nome": "2ª Rodada",
            "slug": "2a-rodada",
            "rodada": 2,
            "status": "agendada"
        },
        "rodada_anterior": null,
        "partidas": [{
                "partida_id": 2155,
                "campeonato": {
                    "campeonato_id": 10,
                    "nome": "Campeonato Brasileiro",
                    "slug": "campeonato-brasileiro"
                },
                "placar": "Cuiabá 2x2 Juventude",
                "time_mandante": {
                    "time_id": 204,
                    "nome_popular": "Cuiabá",
                    "sigla": "CUI",
                    "escudo": "https://apifutebol.s3.sa-east-1.amazonaws.com/escudos/5f999e4424264.svg"
                },
                "time_visitante": {
                    "time_id": 43,
                    "nome_popular": "Juventude",
                    "sigla": "JUV",
                    "escudo": "https://apifutebol.s3.sa-east-1.amazonaws.com/escudos/5f999cb997a01.svg"
                },
                "placar_mandante": 2,
                "placar_visitante": 2,
                "status": "finalizado",
                "slug": "cuiaba-juventude-2155",
                "data_realizacao": "29/05/2021",
                "hora_realizacao": "19:00",
                "data_realizacao_iso": new Date("2021-05-29T19:00:00-0300"),
                "estadio": {
                    "estadio_id": 95,
                    "nome_popular": "Arena Pantanal"
                },
                "_link": "/v1/partidas/2155"
                }],
        "_link": "/v1/campeonatos/10/rodadas/1"
}

const time1 = new Time("Cuiabá", 204)
const time2 = new Time("Juventude", 43)

const rodadaClasse = new Rodada(1);
rodadaClasse.addJogo(new Jogo(time1, time2, new Date("2021-05-29T19:00:00-0300"), 2155))

describe("Testa a classe service: RodadaService", () => {
    describe("Testa criação da classe BrasileiraoService", () => {
        it("Deve criar uma nova instância da classe BrasileiraoService", () => {
            const rodadaService = new RodadaService(10);

            expect(rodadaService).toBeDefined();
        })
    })
    describe("Testa a função que atualiza os jogos das rodada", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar um erro caso não consiga recuperar as rodadas da API", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getRodadasAPI").mockRejectedValueOnce(new Error("Erro ao recuperar dados"));

            const rodadaService = new RodadaService(10);

            expect(rodadaService.updateResultados()).rejects.toThrow();
        })
        it("Deve retornar um erro caso não consiga recuperar as rodadas do banco de dados", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getRodadasAPI").mockResolvedValueOnce([rodada]);
            jest.spyOn(JSONRodadasRepository.prototype, "findAll").mockRejectedValueOnce(new Error("Erro ao ler dados do banco de dados"));

            const rodadaService = new RodadaService(10);

            expect(rodadaService.updateResultados()).rejects.toThrow();
        })
        it("Deve retornar um erro caso não consiga salvar as rodadas atualizadas do banco de dados", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getRodadasAPI").mockResolvedValueOnce([rodada]);
            jest.spyOn(JSONRodadasRepository.prototype, "findAll").mockResolvedValueOnce([rodadaClasse]);
            jest.spyOn(JSONRodadasRepository.prototype, "save").mockRejectedValueOnce(new Error("Erro ao salvar"));

            const rodadaService = new RodadaService(10);

            expect(rodadaService.updateResultados()).rejects.toThrow();
        })
        it("Deve salvar as rodadas atualizadas do banco de dados", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getRodadasAPI").mockResolvedValueOnce([rodada]);
            jest.spyOn(JSONRodadasRepository.prototype, "findAll").mockResolvedValueOnce([rodadaClasse]);
            jest.spyOn(JSONRodadasRepository.prototype, "save").mockResolvedValueOnce();

            const rodadaService = new RodadaService(10);

            expect(rodadaService.updateResultados()).resolves.not.toBeDefined();
        })
    })
    describe("Testa a função que retorna uma rodada para o usuário", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar um erro caso não consiga recuperar as rodadas do banco de dados", async () => {
            jest.spyOn(JSONRodadasRepository.prototype, "findAll").mockRejectedValueOnce(new Error("Erro ao ler dados do banco de dados"));

            const rodadaService = new RodadaService(10);

            expect(rodadaService.getJogosByRodada(1)).rejects.toThrow();
        })
        it("Deve retornar um erro caso a rodada buscada não exista no banco de dados", async () => {
            jest.spyOn(JSONRodadasRepository.prototype, "findAll").mockResolvedValueOnce([rodadaClasse]);

            const rodadaService = new RodadaService(10);

            expect(rodadaService.getJogosByRodada(2)).rejects.toThrow();
        })
        it("Deve retornar a rodada corretamente", async () => {
            jest.spyOn(JSONRodadasRepository.prototype, "findAll").mockResolvedValueOnce([rodadaClasse]);

            const rodadaService = new RodadaService(10);

            expect(rodadaService.getJogosByRodada(1)).resolves.toEqual(rodadaClasse);
        })
    })
})