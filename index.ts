// EXEMPLO DE USO => logar um usuário, salvar suas apostas e imprimir um log confirmando a aposta feita
// log será uma lista de cada aposta no formato abaixo
// NOME_TIME_MANDANTE GOLS_MANDANTE x GOLS_VISITANTE NOME_TIME_VISITANTE

import Usuario from "./src/models/Usuario";
import Rodada from "./src/models/Rodada";
import ApostaRodada from "./src/models/ApostaRodada";
import { Palpite } from "./src/models/ApostaJogo";

import JSONApostaRodadasRepository from "./src/repositories/JSONApostaRodadasRepository";
import JSONRodadasRepository from "./src/repositories/JSONRodadasRepository";
import JSONTimesRepository from "./src/repositories/JSONTimesRepository";
import JSONUsuariosRepository from "./src/repositories/JSONUsuariosRepository";
import { HashSenha } from "./src/models/HashSenha";

const usuariosRepository = new JSONUsuariosRepository();
const timesRepository = new JSONTimesRepository();
const rodadaRepository = new JSONRodadasRepository();
const apostaRodadaRepository = new JSONApostaRodadasRepository();

const palpites: Palpite[] = [];
for (let i = 0; i < 10; i++) {
    palpites.push({
        golsMandante: 2,
        golsVisitante: 1,
        jogoId: i + 1,
    });
} 

type Login = {
  email: string;
  senha: string;
};


function getRodadaByPalpites(
  usuario: Usuario,
  rodada: Rodada,
  palpites: Palpite[]
): ApostaRodada {
  const jogos = rodada.getJogos()
  const apostasRodada = new ApostaRodada(usuario);

  for (const jogo of jogos) {
    for (const palpite of palpites) {
      if (jogo.getId() === palpite.jogoId) {
        apostasRodada.addApostaJogo( palpite, jogo, usuario);
      }
    }
  }
  return apostasRodada;
}

function getMensagemAposta(apostaRodada: ApostaRodada): string {
  // NOME_TIME_MANDANTE GOLS_MANDANTE x GOLS_VISITANTE NOME_TIME_VISITANTE
  // retornar conforme o formato detalhado acima, separando cada jogo com uma nova linha
  let rodadasMensagem: string = "";
  const apostasJogos = apostaRodada.getApostasJogos();
  for (const apostaJogo of apostasJogos) {
    rodadasMensagem += `${apostaJogo.getJogo().getMandante().getNome()} ${apostaJogo.getGolsMandante()} x ${apostaJogo.getGolsVisitante()} ${apostaJogo.getJogo().getVisitante().getNome()} \n\n`
  }
  return rodadasMensagem;
}

async function teste(login: Login, numeroRodada: number, palpites: Palpite[]) {
  // login
  const usuario = await usuariosRepository.findByEmail(login.email);

  if(usuario.getSenha() !== HashSenha.hash(login.senha)) {
    throw "Login invalido";
  }

  // lista os jogos de uma rodada especifica
  const rodada = await rodadaRepository.findByNumeroRodada(numeroRodada);

  // listar times para fazer join com os dados das rodadas
  const times = await timesRepository.findAll();

  // constroí objeto com as apostas do jogador.
  const apostaRodada = getRodadaByPalpites(usuario, rodada, palpites);
  
  console.log(getMensagemAposta(apostaRodada));
  apostaRodadaRepository.save(apostaRodada);
}


// apostar nos jogos de um rodada especifica
teste({ email: "coleta@rarolabs.com.br", senha: "123456" }, 1, palpites)
  .then(() => console.log("Finalizado com sucesso"))
  .catch((error) => console.log("Ocorreu um erro", error));
