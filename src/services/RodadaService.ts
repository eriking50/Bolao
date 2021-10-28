import RodadasRepository from "../repositories/RodadasRepository";
import JSONRodadasRepository from "../repositories/JSONRodadasRepository";
import BrasileiraoClient from "../clients/BrasileiraoClient";
import Rodada from "../models/Rodada";

export default class RodadaService {
    protected rodadasRepository: RodadasRepository;
    protected brasileiraoClient: BrasileiraoClient;

    constructor(idCampeonato: number) {
        this.rodadasRepository = new JSONRodadasRepository();
        this.brasileiraoClient = new BrasileiraoClient(idCampeonato);
    }

    public async updateResultados(): Promise<void> {
        try {
            const [rodadasAtual, dadosCampeonato] = await Promise.all([this.rodadasRepository.findAll(), this.brasileiraoClient.getDadosCampeonatoAPI()]);
            const promises = dadosCampeonato.map(dadosRodada => this.brasileiraoClient.getRodadasAPI(dadosRodada.rodada));
            
            const rodadasResponse = await Promise.all(promises);

            const rodadasAtualizada = rodadasAtual.map(rodada => {
                rodadasResponse.map(rodadaResponse => {
                    rodada.getJogos().map(jogo => {
                        rodadaResponse.partidas.map(partida => {
                            if (jogo.getId() === partida.partida_id && partida.status === "finalizado") {
                                jogo.atualizaResultado(partida.placar_mandante, partida.placar_visitante);
                            }
                        })
                    })
                })
                return rodada;
            })
            return await this.rodadasRepository.save(rodadasAtualizada);
        } catch (error) {
            throw new Error(`Falha ao atualizar os jogos no banco de dados. Motivo: ${error.message}.`);
        }
    }

    public async getJogosByRodada(numeroRodada: number): Promise<Rodada> {
        const rodadas = await this.rodadasRepository.findAll();
        const rodadaBuscada = rodadas.find(rodada => {
            return rodada.getNumeroRodada() === numeroRodada;
        })
        if (rodadaBuscada) {
            return rodadaBuscada;
        }

        throw new Error("Essa rodada não existe.");
    }
}