# Um “To Do” Fullstack Javascript, do Node ao React + Webpack (Parte 3)

*Publicado em: Mon, 10 Sep 2018 22:42:01 GMT*
*[Artigo original no Medium](https://medium.com/@arielpchara/um-to-do-fullstack-javascript-do-node-ao-react-webpack-parte-3-1716a5d49840)*

---

Estamos de volta!

Agora que temos nosso micro serviço para persistir os dados da nossa lista de tarefas, vamos construir a interface dessa API, que vai ter os seguintes recursos: adicionar uma nova tarefa, alterar o status dela, remover a tarefa, e filtrar as tarefas da lista.

Vamos criar um projeto React bem do princípio e nesse artigo vamos aprender a configurar o webpack com o mínimo para um desenvolvimento sem *stress. *Além de fazer um *hello world* em React.

Vamos iniciar nossa aplicação em um novo diretório:

```bash
# entra na pasta do projeto
cd fullstack_javascript
# cria uma pasta para o front
mkdir front
# entra na pasta do front
cd front
# inicia como um módulo NPM
npm init -y
```

Vamos instalar os primeiros pacotes do webpack:

```bash
npm i -D webpack webpack-cli
# i = instalar
# -D = pacotes apenas para desenvolvimento
```

Como instalamos o pacote do webpack local, para executar precisamos utilizar o *npm scripts* que é configurado no arquivo *package.json*:

> *[ver código no gist]*

#### Agora configure o Webpack!

Escrever o tal javascript "moderno" te coloca um uma sinuca de bico, já que os navegadores não sabem ler o código *modernoso*, então nós precisamos de "tradutores", ou transpiladores. O transpilador mais utilizado é o Babel esse cara transforma código como o do React em um emaranhado de javascript, que o navegador entende.

Mas e o Webpack? Bom a função dele não traduzir o código, mas gerenciar essa tradução, otimizar o código, carregar imagens, traduzir código CSS e outras coisas a mais, basta ver a lista de Plugins.

> Show me the code!

> *[ver código no gist]*

Note os comentários no código eles explicam o que cada pedaço faz para o Webpack.

Vamos rodar nosso primeiro *build*:

Crie um arquivo chamado *./src/index.js* apenas com `console.log('hello')` e execute o seguinte comando:

> npm run build

Na pasta raiz do projeto crie um arquivo chamado index.html como este conteúdo:

> *[ver código no gist]*

Abra o *index.html* em um navegador e abra o *devtools* (opt + cmd + i), e na aba console veja a mensagem *"hello"* que colocamos no *src/index.js.*

Mas vamos além e mostrar alguma coisa no navegador assim como esperamos.

Precisamos instalar mais algumas coisas:

```
npm i -D babel-loader @babel/core @babel/preset-env @babel/preset-react
```

No *webpack.config.js* acrescentamos as configurações em module:

> *[ver código no gist]*

Agora vamos escrever um código em React, que vai virar um código legível para navegador.

Instale os pacotes:

```
npm i -S react react-dom// -S para salvar no package.json
```

Agora no arquivo *./src/index.js* escreva o seguinte código:

> *[ver código no gist]*

Novamente execute:

> npm run build

E quando acabar abra o index.html em um navegador, e espera-se que apareça um maravilhoso:

Agora em nossa aplicação temos dois pacotes: um com nosso micro serviço, outro com nosso front, e já contamos com um webpack para executar a transpilação no nosso código em React.

Vimos aqui como configurar o webpack no mínimo, para que gere um javascript legível para os navegadores, e como configurar este webpack para interpretar códigos do React.

No próximo artigo vamos criar nosso primeiro componente e já fazer a primeira requisição à API.

[Próxima etapa — Parte 4](https://medium.com/@arielpchara/um-to-do-fullstack-javascript-do-node-ao-react-webpack-parte-4-1dd20bbd63aa)

Abraço