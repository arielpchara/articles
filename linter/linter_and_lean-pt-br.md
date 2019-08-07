# Linter e Lean

## Objetivo
Mostrar o que uma ferramenta de linter tem a ver com metodologia Lean

## O que é um Linter
É uma ferramenta de verificação estática de código

## O que é o Lean
É um método desenvolvido pela toyota para redução de desperdícios

## O que tem uma coisa a ver com a outra ?

Um dos pontos de atenção do Lean é a prevenção de erros humanos para assim reduzir os desperdícios.
Aplicando essa regra a um processo de desenvolvimento de software podemos adicionar alguns processos para evitar desperdícios como: refatorações, conflitos ou inconsistência de código.

Testes unitários podem rodar no pipeline ou até mesmo em gatilhos antes do código ser enviado ao repositório remoto, ainda que estes testes demore somente alguns segundos a ocorrência deles é burocrática e espaçada.

Aqui entra a vantagem de uma ferramenta de Lint, que quando integrada a ferramenta de IDE, o VS Code por exemplo, vai analisar e testar o seu código em tempo real, podendo até mesmo corrigir o problema assim que você salvar o arquivo.

A mágica funciona com estes dois sistemas: o [ESLint](https://eslint.org/) e o [Prettier](https://prettier.io/).

O ESLint é quem vai verificar o seu código e verificar o que está errado, de acordo com algumas regras, que você pode configurar.

`npm i eslint -D`

O Prettier vai formatar o seu código de uma forma bem elegante e se configurado corretamente vai obedecer as regras ja estabelecidas pelo ESLint.

`npm i prettier -D`

As regras para o ESLin (caso você não queira se preocupar com os detalhes) podem ser definidas a partir de um conjunto de regras ja utilizadas por outras pessoas, como google, airbnb e o [standard](https://github.com/standard/eslint-config-standard).

Mas não se preocupe a configuração fica muito simples quando inicializada com o cli do eslint, que vai te perguntar como você que configurar o teu lint.

`./node_modules/.bin/eslint --init`

Para ver melhor como se configura acesse o [documentação](https://eslint.org/docs/user-guide/getting-started).

Nos meus projetos eu utilizo o standard por causa da sintaxe mais moderna.

O ESLint possui uma infinidade de plugins e configurações a além daquelas que o standard te oferece, que ajudam a resolver questões como: complexidade ciclomática, callback hell, linas por arquivo, linhas por função, uso de const e let, entre outros.

Para integrar o prettier no ESLint tem esse documento [aqui](https://prettier.io/docs/en/integrating-with-linters.html) que te informa como configurar.

Para finalizar indico configurar o [Husky](https://github.com/typicode/husky) e adicionar um hook para verificar o lint sempre antes de fazer um commit (pre-commit).

```js
// .huskyrc
{
  "hooks": {
    "pre-commit": "npm run lint"
  }
}
```

## Conclusão
Implementar uma verificação automatizada do seu código,vai ajuda na entrega do seu código auxiliando e muito principalmente nos processos de code review, evitando assim o desperdício de tempo em leitura de código e de refatoração por razões de formatação ou padrão de sintaxe.

![Imagem da internet](codereview_friendly.png)













