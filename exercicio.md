# Exercicio Semana 6

Pessoal, boa noite. Segue a descrição do exercicio da semana:
* Vocês devem implementar as user stories abaixo na camada de serviço do projeto bolão
* Os arquivos com essas implementações é uma escolha de vocês, use o bom senso para separa-las em escopos/serviços que
fazem sentido.
* Vocês devem utilizar o JEST para testarem unitariamente todas essas funcionalidades

# Usuario ---------------------------------------------------------------------------------------------------------------------------------

#### User Story 1:
 [x] Como usuário, eu gostaria de criar minha conta no bolão
  ** [x] a senha deve ser gravada em forma de hash, utilizando o algoritmo getHash já utilizado nas semanas anteriores
  ** [x] devo inserir um e-mail em formato válido e único, caso contrário, meu cadastro deve ser negado


#### User Story 2:
 [x] Como usuário, eu gostaria de realizar login, utilizando meu e-mail e senha.
  ** [x] Caso a senha ou e-mails não estejam corretos, a aplicação deve lançar uma exceção informando que usuário não existe ou está incorreto 


#### User Story 3:
 [x] Como usuário, eu gostaria de alterar meu cadastro
  ** [x] Eu posso alterar todos os campos, menos o meu e-mail


#### User Story 4:
 [x] Como usuário, eu gostaria de ter a possibilidade de inativar meu cadastro
  ** [x] a inativação deve ser lógica, ou seja, devo somente inativar o usuário, e não deleta-lo.

# Rodada ---------------------------------------------------------------------------------------------------------------------------------

#### User Story 5:
 [x] Como usuário, eu gostaria que o placar dos jogos fosse atualizado de acordo com a API do Brasileirão utilizada
 na semana 5
  ** [x] Cuidado com os jogos que ainda não foram realizados e estão sem placar

#### User story 6:
 [x] Como usuário, eu gostaria de visualizar uma rodada e seus jogos