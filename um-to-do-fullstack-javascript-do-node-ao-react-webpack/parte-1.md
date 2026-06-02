# Um "To Do" Fullstack Javascript, do Node ao React + Webpack (Parte 1)

*Publicado em: Tue, 04 Sep 2018 20:54:21 GMT*
*[Artigo original no Medium](https://medium.com/@arielpchara/um-to-do-fullstack-javascript-do-node-ao-react-webpack-parte-1-8bbca286715)*

---

É preciso ter um conhecimento mínimo de javascript para seguir este tutorial, e é indicado a quem gostaria de aprender sobre o ciclo completo de uma aplicação 100% em javascript.

#### O NodeJS:

Vamos criar uma aplicação de micro serviço bastante simples, sem utilizar frameworks, conectando em um banco de dados MongoDB e tratando requisições CORS (quando a interface está em outro domínio, diferente da API).

IMPORTANTE: Para começar este projeto você precisa do Node instalado, minha sugestão é instalá-lo via NVM, que vai te ajudar a gerenciar as versões do Node.

> NVM: [https://github.com/creationix/nvm](https://github.com/creationix/nvm)

#### Porque React?

É uma biblioteca bastante versátil para criação de interfaces web dinâmicas, vamos ver alguns conceitos, como: containers, HOC e code spliting.

Para começar eu disponibilizei um repositório com varias branches, que contem as etapas da construção do APP.

> [https://github.com/arielpchara/full-stack-javascript](https://github.com/arielpchara/full-sack-javascript)

### Vamos começar com a API

Como uma aplicação moderna de javascript ele precisa estar configurado como um módulo NPM, essa API precisa da versão 8.11.4 do Node use NVM para atualizar sua verão.

> NPM é um gerenciador de pacotes para javascript

```bash
# cria uma pasta para o projeto
mkdir fullstack_javascript
# entra na pasta do projeto
cd fullstack_javascript
# cria uma pasta para a API
mkdir api
# entra na pasta da API
cd api
# inicia a API como um módulo NPM
npm init -y
```

Isso deve criar um arquivo chamado package.json, este arquivo vai conter as informações sobre o modulo, como nome, versão, descrição. Além de ajudar a executar alguns scripts para você.

Agora adicione um arquivo chamado index.js

E insere o seguinte código:

> *[ver código no gist]*

Para facilitar o desenvolvimento do nosso código é interessante utilizar o pacote nodemon, que detecta toda alteração do código e atualiza o servidor.

> Instale: npm i -D nodemon

Para rodar o nodemon que foi instalado localmente, tem que adicionar um script no package.json.

```json
"scripts": {
  "dev": "nodemon index.js"
}
```

> Rode: npm run dev

O resultado no navegador é o seguinte:

### Já tem o MongoDB instalado, maravilha!

> Caso não tenha segue o site com instruções para isso: [https://www.mongodb.com/download-center?jmp=nav#community](https://www.mongodb.com/download-center?jmp=nav#community).

Com o MongoDB devidamente instalado, vamos fazer o servidor conectar com o banco de dados; leia os comentários e veja o que cada parte do código faz.

> *[ver código no gist]*

Provavelmente quando você acessar o servidor vai ter alguma coisa assim:

Ok, agora vamos fazer nossa API adicionar novos documentos em nossa coleção. Para isso vamos ter que fazer uma requisição com método POST e para nos ajudar, vamos usar o Postman, que pode ser adicionado como uma extensão do Chrome e ou instalado na sua maquina, veja em :

> [https://www.getpostman.com/](https://www.getpostman.com/)

Ao fazer a requisição post o retorno será o mesmo que no navegador apenas um array vazio, isso porque não tratamos o método POST no nosso servidor, bora fazer isso.

> *[ver código no gist]*

Agora nosso serviço vai receber o POST e colocar o body como um novo documento para nossa coleção.

Lembre-se o POST deve ter um body no formato JSON, vamos ver no Postman como fica:

Agora vejamos se o documento foi para nossa coleção:

No nosso código tratamos também de casos não esperados para nosso serviço que deve retornar um JSON com uma mensagem de invalid request.

Concluímos essa primeira parte, com um servidor http bem simples, que aceita os métodos GET e POST, onde o GET retorna todos os item da coleção e o POST cria um novo documento.

Próximo artigo vamos adicionar o método PUT para editar o documento no banco.

Segue para o próximo artigo [https://medium.com/@arielpchara/um-to-do-fullstack-javascript-do-node-ao-react-webpack-parte-2-4a3214360f3b](https://medium.com/@arielpchara/um-to-do-fullstack-javascript-do-node-ao-react-webpack-parte-2-4a3214360f3b)

Abraço!