Backend simulando uma aplicação real similar ao Twitter.
Primeiramente para utilizar o sistema precisar instalar as dependencias, visto que node_modules não esta no repositorio.
Entao deve-se configurar o arquivo env_file, preencher todos campos de acordo com sem ambiente local, e utilizar algum valor em 'authSecret', qualquer valor serve.
Caso esteja usando um banco de dados que não seja mysql alter o valor do campo 'client' no arquivo knexfile.js
O programa esta rodando na porta 3000, isso pode ser alterado no arquivo index.js
Todas migrations são feitas ao rodar o codigo com "npm start"

As rotas para utillização se encontram no arquivo "routes.js" na paste config, todos comentados para facilitar o uso.
Todas rotas são somente acessadas somente por quem ja esta logado no sistema, exceto '/signin', '/signup' e '/validateToken' que são publicas.
O usuario após criar sua conta na rota '/signup' pode se logar no sistema através da rota '/signin', quando o fizer irá receber um token que deverá usar para acessar todas as rotas que não são publicas.
Para usar o token bastar criar um header "Authorization" e colocar seu valor como "bearer <token>" sem usar os <> no token

Funcionalidades:
1.O usuário pode criar, excluir**, editar e visualizar sua conta.
2.O usuário pode criar, excluir*, editar e visualizar suas publicações.
3.O usuário pode criar, excluir, editar e visualizar comentários em suas publicações.
4.O usuário pode criar, excluir, editar e visualizar seus comentários em publicações de outros usuários.
5.O usuário pode visualizar a listagem de todas as publicações de todos usuários, ordenadas por data.

Formato do json para cadastro:
{
    "name": "seu nome",
    "email: "seu_email@email.com",
    "password": "sua senha",
    "confirmPassword": "sua senha"
}

Formato do json para login:
{
    "email: "seu_email@email.com",
    "password": "sua senha"
}

Formato do json para postar um twitt:
{
    "content: "Seu twitt"
}

Formato do json para postar um comentario:
{
    "content: "Seu twitt",
    "twittId": "Id do twitt que deseja comentar"
}

Restrições:
1.O usuário NÃO PODE excluir e editar a conta de outros usuários.
2.O usuário NÃ0 PODE excluir e editar as publicações de outros usuários.
3.O usuário NÃ0 PODE excluir e editar as comentários de outros usuários.
4.Numero maximo de caracteres é de 140 tanto para twitts quanto comentarios. 

*Ao excluir um twitt todos os comentarios associados são excluidos, sejam do usuario ou de terceiros.
**A conta é excluida através de soft delete, logo ela permanece no banco de dados, mas não é listada nas contas da aplicação.
**Ao excluir uma conta todos os twitts/comentarios associados são excluidos, sejam do usuario ou de terceiros.