# Pode ser que você precise de uma experiência melhor com TDD

Inspirado em um texto que li sobre a supervalorização de testes unitários, resolvi escrever este texto para mostrar meu ponto de vista sobre testes automatizados — unitários, de integração ou de ponta a ponta — e como a ordem em que você pensa sobre eles muda tudo.

Este texto busca mostrar uma jornada de implementação, aplicando técnicas que acredito ser uma boa prática de uso de testes.

## Antes de começar: a ordem importa

Tem um hábito muito comum nos times: escrever o código primeiro e os testes depois. Parece razoável, afinal você precisa ter o código para testar, certo?

O problema é que testes escritos depois tendem a validar a implementação que você criou, não o comportamento que você precisava. Você molda os testes para cobrir o código que existe — não para definir o contrato que deveria existir.

TDD inverte essa ordem. Você escreve o teste antes, e o código nasce para satisfazê-lo.

O ciclo tem três passos — **Red → Green → Refactor**:
- **Red** — escreva um teste que falha. Ele define o que você quer.
- **Green** — escreva o mínimo de código para o teste passar.
- **Refactor** — melhore o código sem quebrar os testes.

A disciplina está em respeitar os três. Especialmente não pular o "mínimo de código" e ir direto para uma solução elaborada.

Tem também algumas ideias que circulam sobre TDD que valem desfazer antes de continuar:

"TDD é sobre cobertura de código" — não é. 100% de coverage não significa que os testes são úteis.
"Testes unitários são os mais importantes" — não necessariamente. Um teste unitário que mocka tudo pode passar 100% enquanto o sistema inteiro está quebrado.
"TDD é lento" — é mais lento no começo de uma feature. É muito mais rápido quando você precisa mudar essa feature seis meses depois.

## A pirâmide de testes

Antes de entrar nas jornadas, vale alinhar onde cada tipo de teste se encaixa.

```
        /\
       /  \
      / E2E \        ← poucos, lentos, caros
     /--------\
    /Integration\    ← moderados
   /--------------\
  /   Unit Tests   \ ← muitos, rápidos, baratos
 /------------------\
```

Cada camada tem um papel diferente:
- **Unitários** — testam lógica isolada de uma função ou módulo. Rápidos, fáceis de manter.
- **Integração** — testam a colaboração entre partes. Um módulo chamando outro, I/O real.
- **E2E** — testam o fluxo completo do usuário. Lentos e caros de manter.

O erro mais comum é inverter essa pirâmide: poucos unitários, nenhuma integração, tudo no E2E. O resultado é uma suite lenta, frágil, e que quando quebra não te diz onde está o problema.

## Cenário

O projeto possui diversos produtos, e um time para cada produto.
Existe uma grande necessidade de se reutilizar código entre todos os produtos.
Cada time é especializado em resolver os problemas de negócio.
Existe um time especializado em resolver problemas técnicos de todos os times.
As bibliotecas criadas devem ter um alto nível de confiança.
Documentação e uniformidade na utilização das bibliotecas são fatores primordiais para estes produtos técnicos.

Vamos separar estes exemplos em duas jornadas:
  - Desenvolvimento de ferramentas (bibliotecas)
  - Desenvolvimento de produto

## Jornada de desenvolvimento de ferramentas (bibliotecas)

Este time tem como objetivo construir uma estrutura tecnológica para receber as necessidades do produto (business), portanto antecipar as necessidades é uma característica importante.

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
  const data = await connector.getData('/users')
  console.log(data)
}
```

Muito provavelmente esta documentação vai evoluir, mas isso vai te ajudar a concentrar no problema a ser resolvido de uma forma mais objetiva. O nome das funções, os parâmetros, o que retorna — tudo isso fica claro antes de você abrir um arquivo de implementação.

### Agora começa a jornada dos testes

Como você já tem a assinatura da função, transforme essa documentação em testes. O teste não conhece a implementação — ele só conhece o contrato que você acabou de definir:

```ts
// connector.test.ts
import { createConnector } from '@company/tools'

describe('createConnector', () => {
  it('retorna os dados do endpoint informado', async () => {
    const connector = createConnector({ uri: 'http://localhost:3000' })

    const data = await connector.getData('/users')

    expect(data).toEqual([{ id: 1, name: 'Alice' }])
  })

  it('lança um erro quando o endpoint não está acessível', async () => {
    const connector = createConnector({ uri: 'http://host-inexistente' })

    await expect(connector.getData('/users')).rejects.toThrow()
  })

  it('respeita o timeout configurado', async () => {
    const connector = createConnector({ uri: 'http://servidor-lento', timeout: 100 })

    await expect(connector.getData('/users')).rejects.toThrow(/timeout/i)
  })
})
```

Esses testes vão falhar — e isso é esperado. É o **Red** do ciclo.

Agora escreva o mínimo para passarem (**Green**):

```ts
// connector.ts
import axios from 'axios'

export function createConnector(config: { uri: string, timeout?: number }) {
  const client = axios.create({
    baseURL: config.uri,
    timeout: config.timeout ?? 10000
  })

  return {
    async getData<T>(path: string): Promise<T> {
      const response = await client.get<T>(path)
      return response.data
    }
  }
}
```

Os testes passam. Agora é hora do **Refactor** — extrair constantes, melhorar tipos, organizar melhor — sem quebrar nada.

### O teste de integração fecha o contrato

Os testes unitários acima podem usar um servidor mock. Mas para uma biblioteca de infraestrutura, você quer pelo menos um teste que use uma conexão real — para garantir que o contrato funciona de verdade, não só na simulação:

```ts
// connector.integration.test.ts
import { createConnector } from '@company/tools'
import { startMockServer, stopMockServer } from './test-helpers'

describe('connector — integração', () => {
  let serverUrl: string

  beforeAll(async () => {
    serverUrl = await startMockServer([
      { method: 'GET', path: '/users', response: [{ id: 1, name: 'Alice' }] }
    ])
  })

  afterAll(() => stopMockServer())

  it('busca dados reais via HTTP', async () => {
    const connector = createConnector({ uri: serverUrl })
    const data = await connector.getData('/users')
    expect(data).toEqual([{ id: 1, name: 'Alice' }])
  })
})
```

Testes unitários cobrem a lógica. Testes de integração cobrem a cola entre as partes.

## Jornada de desenvolvimento de produto

O time de produto resolve problemas de negócio. Aqui o TDD tem um sabor diferente: você não está definindo uma API para outros desenvolvedores — você está implementando regras que existem na cabeça de alguém (PO, stakeholder, usuário).

**Como resolver primeiro o contrato:**

Antes de abrir o editor, pergunte: o que esse código precisa fazer? Escreva os testes em linguagem de comportamento — não de implementação:

```ts
// checkout.test.ts
describe('Checkout', () => {
  it('aplica 10% de desconto quando o carrinho tem mais de 5 itens', () => {
    const cart = createCart([
      { product: 'A', price: 100 },
      { product: 'B', price: 100 },
      { product: 'C', price: 100 },
      { product: 'D', price: 100 },
      { product: 'E', price: 100 },
      { product: 'F', price: 100 },
    ])

    const total = calculateTotal(cart)

    expect(total).toBe(540) // 600 - 10%
  })

  it('não aplica desconto quando o carrinho tem 5 itens ou menos', () => {
    const cart = createCart([
      { product: 'A', price: 100 },
      { product: 'B', price: 100 },
    ])

    const total = calculateTotal(cart)

    expect(total).toBe(200)
  })

  it('aplica frete grátis quando o total após desconto supera 500', () => {
    const cart = createCart([/* 6 itens a 100 cada */])

    const result = checkout(cart)

    expect(result.shippingCost).toBe(0)
  })
})
```

Perceba: os testes descrevem regras de negócio, não implementação. Se o PO mudar a regra de 5 para 10 itens, você atualiza o teste e a implementação segue.

Agora a implementação guiada pelos testes:

```ts
// checkout.ts
const DISCOUNT_THRESHOLD = 5
const DISCOUNT_RATE = 0.10
const FREE_SHIPPING_THRESHOLD = 500

export function calculateTotal(items: CartItem[]): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const discount = items.length > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0
  return subtotal - discount
}

export function checkout(items: CartItem[]) {
  const total = calculateTotal(items)
  return {
    total,
    shippingCost: total > FREE_SHIPPING_THRESHOLD ? 0 : 20
  }
}
```

### Quando mockar e quando não mockar

Uma das maiores confusões em testes de produto é o uso excessivo de mocks. A regra prática é simples:
- Mock **dependências externas** (APIs, banco de dados, serviços terceiros)
- **Não mock** a lógica de negócio que você está testando

```ts
// ✅ correto — mock da dependência externa, lógica real
it('salva o pedido após o checkout', async () => {
  const mockRepository = { save: jest.fn().mockResolvedValue({ id: 'order-123' }) }
  const service = new OrderService(mockRepository)

  const result = await service.placeOrder(cart)

  expect(mockRepository.save).toHaveBeenCalledWith(
    expect.objectContaining({ total: 540 })
  )
  expect(result.id).toBe('order-123')
})

// ❌ errado — mockando a própria lógica que deveria ser testada
it('calcula o total', () => {
  jest.spyOn(checkout, 'calculateTotal').mockReturnValue(540)
  // isso não testa nada útil
})
```

### E2E para os fluxos que mais importam

Não use E2E para tudo — é caro e lento. Use para os fluxos que, se quebrarem, causam mais dano:

```ts
// checkout.e2e.test.ts
it('conclui uma compra do carrinho até a confirmação', async () => {
  const user = await createTestUser()
  const session = await loginAs(user)

  await session.addToCart([{ productId: 'prod-1', quantity: 6 }])

  const order = await session.checkout({
    paymentMethod: 'credit_card',
    address: testAddress
  })

  expect(order.status).toBe('confirmed')
  expect(order.discount).toBeGreaterThan(0)
})
```

## Coisas que fazem um teste valer a pena

Alguns cuidados que fazem diferença no dia a dia:

**Nomear como comportamento, não como código**
```ts
// ❌ não diz o que falhou
it('should work', () => { ... })

// ✅ auto-documentado
it('retorna 404 quando o usuário não existe', () => { ... })
```

**Não testar detalhes de implementação**
```ts
// ❌ frágil — qualquer refactor quebra
expect(service._internalCache.size).toBe(1)

// ✅ robusto — testa o que é observável
expect(await service.getUser(1)).toEqual({ id: 1, name: 'Alice' })
```

**Usar factories para montar dados de teste**

Quando o `beforeEach` tem 50 linhas, ninguém sabe mais o que o teste verifica. Factories resolvem isso:

```ts
// ✅ legível, sem ruído
const cart = cartFactory.withItems(6).withPricePerItem(100).build()
const total = calculateTotal(cart)
expect(total).toBe(540)
```

## Para resumir

TDD não é sobre testes. É sobre design guiado pelo comportamento que você quer ver.

Comece pelo contrato — como será usado, não como será implementado.
Escreva o teste que falha antes de qualquer código.
Implemente o mínimo para passar, depois refatore.
Use a pirâmide: muitos unitários, alguns de integração, poucos E2E.
Nomeie testes como comportamentos, não como linhas de código.

A disciplina de TDD parece mais lenta no começo. Mas é ela que permite que um projeto evolua por anos sem se tornar intocável.
