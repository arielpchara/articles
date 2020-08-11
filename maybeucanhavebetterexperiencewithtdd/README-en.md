# PODE SER QUE VOCÊ PRECISE DE UMA NOVA EXPERIENCIA COM TDD

Inspirado em um outro teto que li sobre uma supervalorização de Testes Unitários resolvi escrever este texto para mostrar meu ponto de vista sobre testes automatizados, unitários, de integração ou de ponta a ponta.

Este texto busca mostra uma jornada de implementação, aplicando técnicas que acredito ser uma boa prática de uso de testes.

## Cenário

O projeto possui diversos produtos, e um time para cada produto.
Exite uma grande necessidade de se reutilizar código entre todos os produtos.
Cada time é especializado em resolver os problemas de negocio.
Existe um time especializado em resolver problemas técnicos de todos os times.
As bibliotecas criadas devem ter um alto nível de confiança.
Documentação e uniformidade na utilização das bibliotecas são fatores primordiais para estes produtos técnicos.


Vamos separa estes exemplos em duas jornadas:
  - Desenvolvimento de ferramentas (bibliotecas)
  - Desenvolvimento de produto

### Jornada de desenvolvimento de ferramentas (bibliotecas)

Este time tem como objetivo construir uma estrutura tecnológica para receber as necessidades as necessidades do produto (business), portanto antecipar as necessidades é uma característica importante.

O "cliente" deste produto serão os outros desenvolvedores do projeto, assim como clientes deve ter a confiança que o produto utilizado cumpre o que promete, e para que isso seja atendido é fundamental uma boa explicação da ferramenta, com documentação e manuais de utilização.

Desta forma, quem for desenvolver deve primeiramente resolver como será feita esta implementação.

**Como resolver primeiro o contrato:**

1. Um bom começo é com aquelas bibliotecas que você admira e gosta de utilizar.
2. Escreva uma pré documentação de como você gostaria de utilizar esta biblioteca, segue um exemplo:
```js
// como usar
import { createConnector } from '@company/tools'

// conexão simples
const connector = createConnector({
  uri: 'http://localhost:3000'
})

async function use() {
  const data = await connector.getData()
  console.log(data)
}
```
Muito provavelmente esta documentação vai evoluir, mas isso vai te ajudar a concentrar no problema a ser resolvido de uma forma mais objetiva.

### Agora começa a jornada dos testes

Como você ja tem a assinatura da função




