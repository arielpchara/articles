# JavaScript assíncrono é um inferno
A forma como o JavaScript lê o código é uma realidade e não temos como fugir disso, é assíncrono e ponto final.
E as formas de lidar com isso são: callbacks, promises, generators e observables.
Callback é quando você passa por parâmetro a função que vai ser executada quando o processo assíncrono terminar.
Promise é uma pattern genérica mas que possui uma implementação pronta em JavaScript, que retorna um objeto que executam as funções que passadas pelo método `then`
Exemplos de callback:


<script src="https://gist.github.com/arielpchara/28f4132d2fb2f745fda515bcd0f65abb.js" ></script>

Veja no exemplo quando esse modelo vira um inferno, são múltiplas closures blocos de função que não terminam, variáveis com mesmo nome que se sobrepõem, e por último, caso a função escale será criado uma instância de função para cada chamada de callback.
Para isso é indicado usar Promise, veja um exemplo:

<script src="https://gist.github.com/arielpchara/b57c866e5029ecb9a377ebfb457b9f52.js" ></script>

Mas aí você veja o último exemplo, não te lembra alguma coisa que começa com PH e termina com P (estruturado)?
E onde fica o aquela coisa bacanuda de funcional ?
Tive um papo recentemente sobre isso, e meu entendimento era de que muito disso passa por uma questão de estilo de programação, e o JavaScript com sua característica de multi-paradigma, gera esses discussões sobre melhor forma.
Mas não é tudo existem limitações razoáveis para se ver em cada formato.
Usando callback existe o risco de overhead, de complexidade, shadowing entre outros riscos, mas se é do estilo escrever o código alguns cuidados devem ser tomados, lembrando que programação funcional tudo é uma função.

<script src="https://gist.github.com/arielpchara/981598c70a0ee848c5fcff7c642462f5.js" ></script>

Ou quando usamos promises ou async//await, o ponto de atenção é você não encher de await fazendo seu código um bloco estruturado, assincronia é bom e devemos utilizar-la.

<script src="https://gist.github.com/arielpchara/36c8c165c019c5fe241a7a852f0fee65.js" ></script>

O plus é que não precisamos trabalhar apenas com a pattern Promise no JS, existe uma outra forma de trabalho utilizando Observables, ou seja, a lib RXJS, segue um exemplo.

<script src="https://gist.github.com/arielpchara/49283f0ea5a1de29aed9df3081673028.js" ></script>

Veja também um exemplo aqui https://github.com/arielpchara/rxjs-react

Mas para resumir não existe uma forma maravilhosa de se resolver as coisas, entenda qual é o propósito do seu código e equalize com a forma que você melhor sabe utilizar.

