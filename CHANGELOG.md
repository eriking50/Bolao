# Bolão - Raro Academy

## UNRELEASED

## SEMANA 6 - [6.0.0] - [2021-10-29]

### Adcionados
- /src/models/helpers/HashHelper.ts
    - Classe abstrata que contém uma função estática que gera o hash de senha.
- /src/models/helpers/EmailHelper.ts
    - Classe abstrata que contém uma função estática que valida o email
- /__tests __/Usuario.spec.ts
    - Arquivo que contém os testes do model Usuario.
- /__tests __/UsuarioService.spec.ts
    - Arquivo que contém os testes do service de Usuario
- /src/services/UsuarioService.ts
    - Arquivo que contém os testes do service de Usuario
- /__tests __/BrasileiraoService.spec.ts
    - Arquivo que contém os testes de BrasileiraoService
- /src/services/RodadaService.ts
    - Arquivo que contém os testes do service de Rodada
- /__tests __/RodadaService.spec.ts
    - Arquivo que contém os testes do service de Rodada

### Modificados
- index.ts
    - Removido função que cria o hash de senha.
- /src/models/Usuário.ts
    - As funções getSenha e setSenha usam a função hash do arquivo /src/models/HashSenha.ts
    - Adcionado uma variável que indica o status do usuário.
- /src/models/Rodada.ts
    - Aumentando data para evitar erros.
    - Alterado função getById para usar .find() ao invés de .forEach()
    - Alterado para private função que atualiza horário limite
    - Alterado data inicial pra ser menos hardcoded
- /helpers/HashHelper
    - Alterado nome de HashSenha para HashHelper
- /src/services/BrasileiraoService.ts
    - Renomeado de brasileirao.ts para BrasileirãoService.ts
    - Alterado retornos das funções getRodadas e getTabela
    - Adicionado pra exportar de forma default a classe
- /src/client/BrasileiraoClient.ts
    - Renomeado de brasileirao.ts para BrasileirãoClient.ts
    - Alterado pra exportar de forma default a classe
    - Alterado types Response para serem exportados

## SEMANA 5 - [5.0.1] - [2021-10-22]

### Modificados
- Alteração geral
    - Alterado o uso de alguns "For" pelo código, adotando uso de .map
- /src/clients/brasileirao.ts
    - Adicionado um array de promises e depois feito Promise.all para resolver todas rodadas de uma vez
    - Alteração na url on o idCampeonato agora é passado via parâmetro no construtor
- /src/services/brasileirao.ts
    - Adicionado um Promise.all
    - Removido linhas desnecessárias

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
- /src/models/Rodada.ts
    - Adcionado testes pra conferir se a data passada para o horario limite é diferente de uma data criada a partir de um valor nulo.

## SEMANA 4 - [4.0.1] - [2021-10-20]

### Modificado
- JSONTimesRepository.ts
    - Alterados funções "For" que busca, por .find
    - Alterado findAll para usar async await
- JSONUsuariosRepository.ts
    - Alterado findAll para usar async await
- JSONRodadasRepository.ts
    - Retirando grande parte da lógica direto do findAll e criando função auxiliar
    - Alterado função "For" que busca, por .find
    - Alterado funçaão "For" usada para montar array, por .map
- JSONApostaRodadasRepository.ts
    - Retirando grande parte da lógica direto do findAll e criando de 2 funções auxiliares para diminuir a lógica no findAll
    - Alterado funçaão "For" usada para montar array, por .map
    
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