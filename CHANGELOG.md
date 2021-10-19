# Bolão - Raro Academy

## UNRELEASED

## SEMANA 6 - [6.0.0] - [2021-10-29]

## SEMANA 5 - [5.0.0] - [2021-10-22]

### Adcionados
- /node_modules/axios
    - Instalado biblioteca do axios e @types para o axios.
- /src/clients/brasileirao.ts
    - Criado arquivo em cliente que faz as requisições na API.
- /src/services/brasileirao.ts
    - Criado arquivo em servies que converte os dados vindos da API para nosso os tipo do Bolão.

### Modificados
- /src/models/Time.ts
    - Removido atributo estado da classe Time.
- /src/repositories/JSONTimesRepository.ts
    - Removido estados nas criação das classes na leitura do arquivo local.
- /CHANGELOG.md
    -Adcionado caminhos para os arquivos especificados pelo changelog

## SEMANA 4 - [4.0.0] - [2021-10-16]

### Adcionados
- /CHANGELOG.md
- /README.md

### Modificados
- /index.ts
    - Adcionado exercício referente a semana 4.
    - Adcionado função que cria as apostas de um usuário.
- /src/models/Usuario.ts
    - Removido função aposta, ela agora se encontra no index.ts
- /src/repositories/JSONUsuariosRepository.ts
    - Modificado algumas funções para usar async/await, apenas o findAll() continua sendo Promise.
- /src/repositories/JSONUsuariosRepository.ts
    - Modificado algumas funções para usar async/await, apenas o findAll() continua sendo Promise.
- /src/repositories/JSONUsuariosRepository.ts
    - Modificado algumas funções para usar async/await, apenas o findAll() continua sendo Promise.
- /src/repositories/JSONUsuariosRepository.ts
    - Modificado algumas funções para usar async/await, apenas o findAll() continua sendo Promise.

### Adcionados
- /src/repositories/JSONUsuariosRepository.ts
    - Arquivo que acessa o repositório de usuários.
- /src/repositories/UsuariosRepository.ts
    - Arquivo que cria a interface para o repositório de usuários.
- /src/repositories/JSONApostaRodadasRepository.ts
    - Arquivo que acessa o repositório de apostas da rodada.
- /src/models/ApostaRodadasRepository.ts
    - Arquivo que cria a interface para o repositório de apostas da rodada.
- teste.ts
    - Arquivo que faz os testes dos repositórios 
- /src/models/Calendario.ts
    - Arquivo que contém a função que gera o calendário de rodadas.

### Modificados
- /src/repositories/JSONTimesRepository.ts
    - Modificado para usar Promises.
- /src/repositories/TimesRepository.ts
    - Modificado para usar Promises.
- /src/repositories/JSONRodadasRepository.ts
    - Modificado para usar Promises.
- /src/repositories/RodadasRepository.ts
    - Modificado para usar Promises.
- /src/models/Usuario.ts
    - Adicionado variável de senha.
- /index.ts
    - Removido função de geração de tabela.

## SEMANA 3 - [3.0.0] - [2021-10-01]

### Adcionados
- /src/repositories/JSONTimesRepository.ts
    - Arquivo que acessa o repositório de times.
- /src/repositories/TimesRepository.ts
    - Arquivo que cria a interface para o repositório de times.
- /src/repositories/JSONRodadasRepository.ts
    - Arquivo que acessa o repositório de rodadas.
- /src/repositories/RodadasRepository.ts
    - Arquivo que cria a interface para o repositório de rodadas.

### Modificados
- /index.ts
    - Criado função que gera as tabelas

## SEMANA 2 - [2.0.0] - [2021-09-24]

### Adcionados
- /index.ts
    - Arquivo principal do projeto.
- /src/models/ApostaJogo.ts
    - Model que define o que é uma aposta de um jogo no sistema.
- /src/models/ApostaRodada.ts
    - Model que define o que é uma aposta de uma rodada no sistema.
- /src/models/Jogo.ts
    - Model que define o que é um jogo no sistema.
- /src/models/Rodada.ts
    - Model que define o que é uma rodada no sistema.
- /src/models/Resultado.ts
    - Model abstrato que possui uma função estática que calcula se houve um ganhador e quem ganhou no sistema.
- /src/models/Time.ts
    - Model que define o que é um time no sistema.
- /src/models/Usuario.ts
    - Model que define o que é um usuário no sistema.

### Removidos
- Removidos os types da versão inicial
    - /bolao/bolao_apostas.ts
    - /bolao/bolao_fun.ts
    - /bolao/bolao_main.ts
    - /bolao/bolao_resultados.ts
    - /bolao/bolao_types.ts
    - /bolao/bolao_usuarios.ts

## SEMANA 1  - [1.0.0] - [2021-09-17]

### Adcionados
- /bolao/bolao_apostas.ts
    -Arquivo que contém as apostas dos usuários.
- /bolao/bolao_fun.ts
    -Arquivo que contém as funções do sistema.
- /bolao/bolao_main.ts
    -Arquivo que contém o método principal do sistema.
- /bolao/bolao_resultados.ts
    -Arquivo que contém os resultados dos jogos.
- /bolao/bolao_types.ts
    -Arquivo que contém os tipos do sistema.
- /bolao/bolao_usuarios.ts
    -Arquivo que contém os usuários do sistema.