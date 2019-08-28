<h1>Backend simulando uma aplicação real similar ao Twitter.</h1>
<p>Primeiramente para utilizar o sistema precisar instalar as dependencias, visto que node_modules não esta no repositorio.</p>
<p>Entao deve-se configurar o arquivo env_file, preencher todos campos de acordo com sem ambiente local, e utilizar algum valor em          'authSecret', qualquer valor serve.</p>
<p>Caso esteja usando um banco de dados que não seja mysql alter o valor do campo 'client' no arquivo 'knexfile.js'.</p>
<p>O programa esta rodando na porta 3000, isso pode ser alterado no arquivo index.js.</p>
<p>Todas migrations são feitas ao rodar o codigo com "npm start".</p>

As rotas para utillização se encontram no arquivo "routes.js" na paste config, todos comentados para facilitar o uso.<br />
Todas rotas são somente acessadas somente por quem ja esta logado no sistema, exceto '/signin', '/signup' e '/validateToken' que são        publicas.<br />
O usuario após criar sua conta na rota '/signup' pode se logar no sistema através da rota '/signin', quando o fizer irá receber um token    que deverá usar para acessar todas as rotas que não são publicas.<br />
Para usar o token bastar criar um header "Authorization" e colocar seu valor como "bearer 'token' " sem usar aspas no token<br />

#### Funcionalidades:<br />
<ol>
<li>O usuário pode criar, excluir*, editar e visualizar sua conta.</li>
<li>O usuário pode criar, excluir*, editar e visualizar suas publicações.</li>
<li>O usuário pode criar, excluir, editar e visualizar comentários em suas publicações.</li>
<li>O usuário pode criar, excluir, editar e visualizar seus comentários em publicações de outros usuários.</li>
<li>O usuário pode visualizar a listagem de todas as publicações de todos usuários, ordenadas por data.</li>
</ol>

**Formato do json para cadastro:**<br />
{<br />
    "name": "seu nome",<br />
    "email: "seu_email@email.com",<br />
    "password": "sua senha",<br />
    "confirmPassword": "sua senha"<br />
}<br />

**Formato do json para login:**<br />
{<br />
    "email: "seu_email@email.com",<br />
    "password": "sua senha"<br />
}<br />

**Formato do json para postar um twitt:**<br />
{<br />
    "content: "Seu twitt"<br />
}<br />

**Formato do json para postar um comentario:**<br />
{<br />
    "content: "Seu twitt",<br />
    "twittId": "Id do twitt que deseja comentar"<br />
}<br />

#### Restrições:<br />
<ol>
<li>O usuário NÃO PODE excluir e editar a conta de outros usuários.</li>
<li>O usuário NÃO PODE excluir e editar as publicações de outros usuários.</li>
<li>O usuário NÃO PODE excluir e editar as comentários de outros usuários.</li>
<li>Numero maximo de caracteres é de 140 tanto para twitts quanto comentarios. </li>
</ol>

<i>*Ao excluir um twitt todos os comentarios associados são excluidos, sejam do usuario ou de terceiros.</i><br />
<i>*A conta é excluida através de soft delete, logo ela permanece no banco de dados, mas não é listada nas contas da aplicação.</i><br />
<i>*Ao excluir uma conta todos os twitts/comentarios associados são excluidos, sejam do usuario ou de terceiros.</i><br />
