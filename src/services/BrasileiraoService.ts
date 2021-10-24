import { BrasileiraoClient } from "../clients/BrasileiraoClient";
import Rodada from "../models/Rodada";
import Time from "../models/Time";
import JSONTimesRepository from "../repositories/JSONTimesRepository";
import TimesRepository from "../repositories/TimesRepository";
import RodadasRepository from "../repositories/RodadasRepository";
import JSONRodadasRepository from "../repositories/JSONRodadasRepository";
import Jogo from "../models/Jogo";

export default class BrasileiraoService {
    private brasileiraoClient: BrasileiraoClient;
    private timesRepository: TimesRepository;
    private rodadasRepository: RodadasRepository;

    constructor(idCampeonato: number) {
        this.brasileiraoClient = new BrasileiraoClient(idCampeonato);
        this.timesRepository = new JSONTimesRepository();
        this.rodadasRepository = new JSONRodadasRepository();
    }

    public async getTimes(): Promise<void> {
        try {     
            const tabelaResponse = await this.brasileiraoClient.getTabelaAPI();

            const times = tabelaResponse.map(({time}) => {
                return new Time(time.nome_popular, time.time_id);
            })
            await this.timesRepository.save(times);
        } catch (error) {
            throw new Error(`Falha ao buscar/salvar times na API. Motivo: ${error.message}.`);
        }
    }

    public async getRodadas(): Promise<void> {
        try {
            const [times, rodadasResponse] = await Promise.all([this.timesRepository.findAll(), this.brasileiraoClient.getRodadasAPI()]);
            
            const rodadas = rodadasResponse.map(rodada => {
                const newRodada = new Rodada(rodada.rodada);
                rodada.partidas.map(partida => {
                    const mandante = times.find(time => time.getId() === partida.time_mandante.time_id);
                    const visitante = times.find(time => time.getId() === partida.time_visitante.time_id);
                    newRodada.addJogo(new Jogo(mandante, visitante, partida.data_realizacao_iso));
                })
                return newRodada;
            })

            await this.rodadasRepository.save(rodadas);
        } catch (error) {
            throw new Error(`Falha ao buscar/salvar rodadas na API. Motivo: ${error.message}.`);
        }
    }
}

export { BrasileiraoService }
