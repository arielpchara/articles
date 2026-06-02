# Um “To Do” Fullstack Javascript, do Node ao React + Webpack (Parte 2)

*Publicado em: Wed, 05 Sep 2018 17:52:28 GMT*
*[Artigo original no Medium](https://medium.com/@arielpchara/um-to-do-fullstack-javascript-do-node-ao-react-webpack-parte-2-4a3214360f3b)*

---

Continuando nossa saga, este artigo vai explicar como implementar o método PUT no nosso serviço.

Espero que você tenha lido a feito as atividades do artigo anterior, caso não tenha lido acesse [este link](https://medium.com/@arielpchara/um-to-do-fullstack-javascript-do-node-ao-react-webpack-parte-1-8bbca286715).

Relembrando o que já vimos, nosso serviço aceita métodos GET e POST, e nós conseguimos inserir no banco de dados um novo documento e listar todos os itens da nossa coleção.

> O Método PUT substitui todas as atuais representações de seu recurso alvo pela carga de dados da requisição.

> [https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods)

A requisição do PUT tem um o ID na url desta forma */recurso/id_documento*, mas como nosso serviço está respondendo tudo na url raiz *http://localhost:3000/*, logo o PUT vai passar o ID assim [*http://localhost:3000/*](http://localhost:3000/)*id_documento*.

#### Show me the code!

> *[ver código no gist]*

Note que no código importamos novas *libs* e funções, também tratamos a url para que o servidor extraia o id do primeiro parâmetro da url, além de adicionar em caso do método ser PUT, verificar se existe um id e executar banco o *replaceOne*.

Agora usando o Postman vamos validar se nosso código funciona:

Primeiro acesse o *endpoint* raiz com método GET que vai te retornar a lista com os documentos se você não tiver nenhum documento, dê uma olhada no artigo anterior e veja lá como adicionar um novo documento utilizando o POST.

Na lista com os documentos copie um *_id* que vamos utilizar em nossa requisição do PUT.

A requisição chama o *endpoint localhost:3000/5b8ee8833e2f3fbaa52acc45* onde essa *string* bagunçada é o nosso *_id* do documento.

O *body* da requisição é um JSON com as mesmas chaves do documento que se quer alterar.

Após enviar o PUT, execute novamente o GET para retornar a lista com os documentos e veja que o documento já não possui os mesmos valores.

Agora temos os três métodos que vamos precisar para construir a aplicação em React, lembrando que será uma lista de tarefas onde vamos adicionar uma *string* com a descrição da atividade, teremos o status quando a atividade ficar pronta e quando ela for removida.

O remover vai ser feito de forma lógica, ou seja, **não** vamos remover o documento do banco, apenas alterar um campo removido para *true*, e deixar de mostrar no front. Por isso não implementamos o método DELETE no nosso serviço.

Por hoje é isso, nos encontramos no próximo artigo, onde vamos configurar o *webpack* e escrever alguma coisa na tela usando o React.

Abraço.

[Ir para a parte Parte 3](https://medium.com/@arielpchara/um-to-do-fullstack-javascript-do-node-ao-react-webpack-parte-3-1716a5d49840)