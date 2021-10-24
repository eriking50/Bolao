import BrasileiraoService from "../src/services/BrasileiraoService";
import JSONTimesRepository from "../src/repositories/JSONTimesRepository";
import JSONRodadasRepository from "../src/repositories/JSONRodadasRepository";
import BrasileiraoClient, { TabelaResponse, RodadaResponse } from "../src/clients/BrasileiraoClient";

const tabela: TabelaResponse = {
    "posicao": 9,
    "pontos": 34,
    "time": {
        "time_id": 204,
        "nome_popular": "Cuiabá",
        "sigla": "CUI",
        "escudo": "https://apifutebol.s3.sa-east-1.amazonaws.com/escudos/5f999e4424264.svg"
    },
    "jogos": 26,
    "vitorias": 7,
    "empates": 13,
    "derrotas": 6,
    "gols_pro": 26,
    "gols_contra": 26,
    "saldo_gols": 0,
    "aproveitamento": 43.6,
    "variacao_posicao": 3,
    "ultimos_jogos": [
        "e",
        "d",
        "e",
        "e",
        "v"
    ]
}
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

describe("Testa a classe service: BrasileiraoService", () => {
    describe("Testa criação da classe BrasileiraoService", () => {
        it("Deve criar uma nova instância da classe BrasileiraoService", () => {
            const brasileiraoService = new BrasileiraoService(10);

            expect(brasileiraoService).toBeDefined();
        })
    })
    describe("Testa a função que pega os times da API e os salva no banco de dados", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar um erro caso não consiga recuperar os times no banco de dados", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getTabelaAPI").mockRejectedValueOnce(new Error("Erro ao recuperar dados"));

            const brasileiraoService = new BrasileiraoService(10);

            expect(brasileiraoService.getTimes()).rejects.toThrow();
        })
        it("Deve retornar um erro caso não consiga salvar os times no banco de dados", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getTabelaAPI").mockResolvedValueOnce([tabela]);
            jest.spyOn(JSONTimesRepository.prototype, "save").mockRejectedValueOnce(new Error("Erro ao salvar"));

            const brasileiraoService = new BrasileiraoService(10);

            expect(brasileiraoService.getTimes()).rejects.toThrow();
        })
        it("Deve salvar os times no banco de dados com sucesso", () => {
            jest.spyOn(BrasileiraoClient.prototype, "getTabelaAPI").mockResolvedValueOnce([tabela]);
            jest.spyOn(JSONTimesRepository.prototype, "save").mockResolvedValueOnce();
            const brasileiraoService = new BrasileiraoService(10);

            expect(brasileiraoService.getTimes()).resolves.not.toBeDefined();
        })
    })
    describe("Testa a função que pega os rodadas da API e os salva no banco de dados", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar um erro caso não consiga recuperar as rodadas da API", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getRodadasAPI").mockRejectedValueOnce(new Error("Erro ao recuperar dados"));

            const brasileiraoService = new BrasileiraoService(10);

            expect(brasileiraoService.getRodadas()).rejects.toThrow();
        })
        it("Deve retornar um erro caso não consiga recuperar os times do banco de dados", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getRodadasAPI").mockResolvedValueOnce([rodada]);
            jest.spyOn(JSONTimesRepository.prototype, "findAll").mockRejectedValueOnce(new Error("Erro ao recuperar dados"));

            const brasileiraoService = new BrasileiraoService(10);

            expect(brasileiraoService.getRodadas()).rejects.toThrow();
        })
        it.skip("Deve retornar um erro caso não consiga salvar as rodadas no banco de dados", async () => {
            jest.spyOn(BrasileiraoClient.prototype, "getRodadasAPI").mockResolvedValueOnce([rodada]);
            jest.spyOn(JSONRodadasRepository.prototype, "save").mockRejectedValueOnce(new Error("Erro ao salvar"));
            
            const brasileiraoService = new BrasileiraoService(10);
            
            expect(brasileiraoService.getRodadas()).rejects.toThrow();
        })
        it.skip("Deve salvar as rodadas no banco de dados com sucesso", () => {
            jest.spyOn(BrasileiraoClient.prototype, "getRodadasAPI").mockResolvedValueOnce([rodada]);
            jest.spyOn(JSONRodadasRepository.prototype, "save").mockResolvedValueOnce();
            const brasileiraoService = new BrasileiraoService(10);
            
            expect(brasileiraoService.getRodadas()).resolves.not.toBeDefined();
        })
    })
})