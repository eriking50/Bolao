import axios from "axios"

const URL_BRASILEIRAO = "https://us-central1-small-talk-3972f.cloudfunctions.net/v1/v1/campeonatos/10";

type TimeTabela = {
    time_id: number,
    nome_popular: string,
    sigla: string,
    escudo: string,
}

export type TabelaResponse = {
    posicao: number,
    pontos: number,
    time: TimeTabela,
    jogos: number,
    vitorias: number,
    empates: number,
    derrotas: number,
    gols_pro: number,
    gols_contra: number,
    saldo_gols: number,
    aproveitamento: number,
    variacao_posicao: number,
    ultimos_jogos: string[]
}

type DadosRodada = {
    nome: string,
    slug: string,
    rodada: number,
    status: string,
}

type Campeonato = {
    campeonato_id: 10,
    nome: string,
    slug: string
}

type Estadio = {
    estadio_id: number,
    nome_popular: string
}

type Partida = {
    partida_id: number,
    campeonato: Campeonato,
    placar: string,
    time_mandante: TimeTabela,
    time_visitante: TimeTabela,
    placar_mandante: number,
    placar_visitante: number,
    status: string,
    slug: string,
    data_realizacao: string,
    hora_realizacao: string,
    data_realizacao_iso: Date
    estadio: Estadio;
    _link: string;
}

export type RodadaResponse = {
    nome: string,
    slug: string,
    rodada: number,
    status: string,
    proxima_rodada: DadosRodada,
    rodada_anterior: DadosRodada,
    partidas: Partida[],
    _link: string
}

export type CampeonatoResponse = {
    nome: string,
    slug: string,
    rodada: number,
    status: string,
    anterior: DadosRodada,
    proxima_rodada: DadosRodada,
    _link: string
}

export default class BrasileiraoClient {
    private idCampeonato: number;

    constructor(idCampeonato: number) {
        this.idCampeonato = idCampeonato;
    }

    public async getTabelaAPI(): Promise<TabelaResponse[]> {
        try {
            const tabela = await axios.get<TabelaResponse[]>(`${URL_BRASILEIRAO}/${this.idCampeonato}/tabela`, {
                headers: {Authorization: 'bearer d44db0cc0676316ee1248780ec04da734e0f06a77c30aaf9a2dcbb1899093361'},
            });
            return tabela.data.sort((timeA, timeB) => timeA.time.nome_popular.localeCompare(timeB.time.nome_popular));
        } catch (error) {
            throw new Error(`Falha ao buscar times na API.`);
        }
    }

    public async getRodadasAPI(): Promise<RodadaResponse[]> {
        try {
            const campeonatoResponse = await axios.get<CampeonatoResponse[]>(`${URL_BRASILEIRAO}/${this.idCampeonato}/rodadas/`, {
                headers: {Authorization: 'bearer d44db0cc0676316ee1248780ec04da734e0f06a77c30aaf9a2dcbb1899093361'},
            });
            const ultimaRodada = campeonatoResponse.data[campeonatoResponse.data.length-1].rodada;  

            const promises = [];
            for (let i = 1; i < ultimaRodada + 1; i++) {
                promises.push(axios.get<RodadaResponse>(`${URL_BRASILEIRAO}/${this.idCampeonato}/rodadas/${i}`, {
                    headers: {Authorization: 'bearer d44db0cc0676316ee1248780ec04da734e0f06a77c30aaf9a2dcbb1899093361'},
                }));
            }

            const responseRodada = await Promise.all(promises);            
            return responseRodada.map(rodada => {
                return rodada.data
            });

        } catch (error) {
            throw new Error(`Falha ao buscar rodadas na API.`);
        }
    }
}

export { BrasileiraoClient }
