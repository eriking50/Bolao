import { BrasileiraoClient } from "../clients/brasileirao";
import Rodada from "../models/Rodada";
import Time from "../models/Time";
import JSONTimesRepository from "../repositories/JSONTimesRepository";
import TimesRepository from "../repositories/TimesRepository";
import RodadasRepository from "../repositories/RodadasRepository";
import JSONRodadasRepository from "../repositories/JSONRodadasRepository";
import Jogo from "../models/Jogo";

class BrasileiraoService {
    private brasileiraoClient: BrasileiraoClient;
    private timesRepository: TimesRepository;
    private rodadasRepository: RodadasRepository;

    constructor() {
        this.brasileiraoClient = new BrasileiraoClient();
        this.timesRepository = new JSONTimesRepository();
        this.rodadasRepository = new JSONRodadasRepository();
    }

    async getTimes() {
        try {     
            const times: Time[] = [];
            const tabelaResponse = await this.brasileiraoClient.getTabelaAPI();
            for (const {time} of tabelaResponse) {
                times.push(new Time(time.nome_popular, time.time_id));
            }
            await this.timesRepository.save(times);
        } catch (error) {
            throw new Error(`Falha ao buscar/salvar times na API. Motivo: ${error.message}.`);
        }
    }

    async getRodadas() {
        try {
            const times = await this.timesRepository.findAll();
            const rodadas: Rodada[] = [];
            const rodadasResponse = await this.brasileiraoClient.getRodadasAPI();

            for (const rodada of rodadasResponse) {
                const newRodada = new Rodada(rodada.rodada);
                for (const partida of rodada.partidas) {
                    const mandante = times.find(time => time.getId() === partida.time_mandante.time_id);
                    const visitante = times.find(time => time.getId() === partida.time_visitante.time_id);
                    newRodada.addJogo(new Jogo(mandante, visitante, partida.data_realizacao_iso));
                }
            rodadas.push(newRodada);
        }

        await this.rodadasRepository.save(rodadas);
        } catch (error) {
            throw new Error(`Falha ao buscar/salvar rodadas na API. Motivo: ${error.message}.`);
        }
    }
}

export { BrasileiraoService }
