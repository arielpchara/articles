# TDD: uma experiência melhor

Inspirado em um texto que li sobre a supervalorização de testes unitários, resolvi escrever meu ponto de vista sobre testes automatizados — unitários, de integração e de ponta a ponta — e como **a ordem em que você pensa sobre os testes muda tudo**.

Este texto não é sobre cobertura de código. É sobre uma forma de trabalhar que usa testes para guiar o design, aumentar a confiança e tornar a evolução do código menos assustadora.

---

## O problema com "escrever testes depois"

A maioria dos times escreve o código primeiro e os testes depois. Isso parece razoável — afinal, você precisa ter o código para testar, certo?

O problema é que testes escritos depois tendem a testar **a implementação** que você criou, não **o comportamento** que você precisava. Você molda os testes para cobrir o código que existe, não para definir o contrato que deveria existir.

TDD inverte essa ordem: **você escreve o teste antes, e o código nasce para satisfazê-lo**.

O ciclo é simples — e é chamado de **Red → Green → Refactor**:

1. **Red** — escreva um teste que falha. Ele define o comportamento esperado.
2. **Green** — escreva o mínimo de código possível para o teste passar.
3. **Refactor** — melhore o código sem quebrar os testes.

Nada além disso. A disciplina está em respeitar os três passos — especialmente não pular o "mínimo de código possível" e ir direto para uma solução elaborada.

---

## Misconceitos comuns

**"TDD é sobre cobertura de código"**
Não é. 100% de coverage não significa que os testes são úteis. Um teste que verifica que `add(2, 2)` retorna `4` cobre a linha mas não garante comportamento de negócio.

**"Testes unitários são os mais importantes"**
Não necessariamente. Um teste unitário que mocka tudo exceto a função sob teste pode passar 100% e ainda assim o sistema como um todo estar quebrado. A **pirâmide de testes** existe para equilibrar isso.

**"TDD é lento"**
TDD é mais lento no início de uma feature. É muito mais rápido quando você precisa mudar essa feature seis meses depois.

**"Eu preciso testar cada linha"**
Você precisa testar **comportamentos**, não linhas. Se um comportamento é coberto por vários caminhos de código, um teste bem escrito pode cobrir todos eles.

---

## A pirâmide de testes

```
        /\
       /  \
      / E2E \        ← poucos, lentos, caros — testam o sistema inteiro
     /--------\
    /Integration\    ← moderados — testam colaboração entre partes
   /--------------\
  /   Unit Tests   \ ← muitos, rápidos, baratos — testam comportamento isolado
 /------------------\
```

Cada camada tem um papel diferente:

| Tipo | O que testa | Velocidade | Custo de manutenção |
|---|---|---|---|
| **Unitário** | Lógica isolada de uma função/classe | Muito rápido | Baixo |
| **Integração** | Colaboração entre módulos, I/O real | Moderado | Moderado |
| **E2E** | Fluxo completo do usuário | Lento | Alto |

O erro comum é **inverter a pirâmide**: ter poucos testes unitários, nenhuma integração, e confiar tudo ao E2E. O resultado é uma suite de testes lenta, frágil e que não diz onde está o problema quando quebra.

---

## Cenário

Para tornar este texto concreto, vamos trabalhar em um contexto real:

> Um projeto com múltiplos produtos e times. Há uma grande necessidade de reutilizar código entre os produtos. Um time é especializado em infraestrutura técnica — ele constrói bibliotecas usadas pelos outros times. As bibliotecas precisam ter alto nível de confiança, boa documentação e API consistente.

Duas jornadas:
- **Desenvolvimento de ferramentas (bibliotecas)**
- **Desenvolvimento de produto (features de negócio)**

---

## Jornada 1: desenvolvimento de ferramentas (bibliotecas)

O time de infraestrutura cria ferramentas para os outros times. Seus "clientes" são desenvolvedores — e assim como qualquer cliente, eles precisam confiar que a ferramenta faz o que promete.

### Passo 1: o contrato vem primeiro

Antes de escrever qualquer implementação, defina como a biblioteca vai ser **usada**. Escreva a documentação de uso antes do código existir:

```ts
// como usar — escrito antes de qualquer implementação
import { createConnector } from '@company/tools'

const connector = createConnector({
  uri: 'http://localhost:3000',
  timeout: 5000
})

async function use() {
  const data = await connector.getData<User[]>('/users')
  console.log(data) // User[]
}
```

Esse exercício força você a pensar na **ergonomia da API** antes de qualquer decisão de implementação. O nome das funções, os parâmetros, o que retorna — tudo isso fica claro aqui.

### Passo 2: os testes definem o contrato

Agora transforme essa documentação em testes. O teste não conhece a implementação — ele só conhece o contrato que você acabou de definir:

```ts
// connector.test.ts
import { createConnector } from '@company/tools'

describe('createConnector', () => {
  it('should return data from the given endpoint', async () => {
    const connector = createConnector({ uri: 'http://localhost:3000' })

    const data = await connector.getData('/users')

    expect(data).toEqual([{ id: 1, name: 'Alice' }])
  })

  it('should throw when the endpoint is unreachable', async () => {
    const connector = createConnector({ uri: 'http://unreachable-host' })

    await expect(connector.getData('/users')).rejects.toThrow()
  })

  it('should respect the configured timeout', async () => {
    const connector = createConnector({ uri: 'http://slow-server', timeout: 100 })

    await expect(connector.getData('/users')).rejects.toThrow(/timeout/i)
  })
})
```

**Esses testes vão falhar.** Isso é esperado — é o **Red** do ciclo.

### Passo 3: implementação mínima para passar (Green)

```ts
// connector.ts
import axios from 'axios'

interface ConnectorConfig {
  uri: string
  timeout?: number
}

export function createConnector(config: ConnectorConfig) {
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

Os testes passam. Agora é hora do **Refactor** — extrair constantes, melhorar nomes, adicionar tipos mais expressivos — sem quebrar os testes.

### Passo 4: testes de integração para garantir o contrato real

Os testes acima podem usar um servidor mock. Mas para uma biblioteca de infraestrutura, você quer pelo menos um teste de integração que use uma conexão real:

```ts
// connector.integration.test.ts
import { createConnector } from '@company/tools'
import { startMockServer, stopMockServer } from './test-helpers'

describe('connector integration', () => {
  let serverUrl: string

  beforeAll(async () => {
    serverUrl = await startMockServer([
      { method: 'GET', path: '/users', response: [{ id: 1, name: 'Alice' }] }
    ])
  })

  afterAll(() => stopMockServer())

  it('fetches real data over HTTP', async () => {
    const connector = createConnector({ uri: serverUrl })
    const data = await connector.getData('/users')
    expect(data).toEqual([{ id: 1, name: 'Alice' }])
  })
})
```

A regra é clara: **testes unitários cobrem a lógica, testes de integração cobrem a cola entre as partes**.

---

## Jornada 2: desenvolvimento de produto (features de negócio)

O time de produto resolve problemas de negócio. Aqui o TDD tem um sabor diferente: você não está definindo uma API para outros desenvolvedores — você está implementando regras que existem na cabeça de alguém (PO, stakeholder, usuário).

### Passo 1: comece pelo comportamento esperado

Antes de abrir o editor, pergunte: **o que esse código precisa fazer?** Escreva os testes em linguagem de comportamento:

```ts
// checkout.test.ts
describe('Checkout', () => {
  it('should apply a 10% discount when the cart has more than 5 items', () => {
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

  it('should not apply discount when cart has 5 or fewer items', () => {
    const cart = createCart([
      { product: 'A', price: 100 },
      { product: 'B', price: 100 },
    ])

    const total = calculateTotal(cart)

    expect(total).toBe(200)
  })

  it('should apply free shipping when total exceeds 500 after discount', () => {
    const cart = createCart([/* 6 items at 100 each */])

    const result = checkout(cart)

    expect(result.shippingCost).toBe(0)
  })
})
```

Perceba: os testes descrevem **regras de negócio**, não implementação. Se o PO mudar a regra de 5 para 10 itens, você atualiza o teste e a implementação segue.

### Passo 2: implementação guiada pelos testes

```ts
// checkout.ts
interface CartItem {
  product: string
  price: number
}

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

### Passo 3: quando mockar e quando não mockar

Uma das maiores confusões em testes de produto é o uso excessivo de mocks.

**Regra prática:**
- Mock **dependências externas** (APIs, banco de dados, serviços terceiros)
- **Não mock** a lógica de negócio que você está testando

```ts
// ✅ correto — mock da dependência externa, lógica real
it('should save the order after checkout', async () => {
  const mockRepository = { save: jest.fn().mockResolvedValue({ id: 'order-123' }) }
  const service = new OrderService(mockRepository)

  const result = await service.placeOrder(cart)

  expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
    total: 540,
    items: cart
  }))
  expect(result.id).toBe('order-123')
})

// ❌ errado — mock da própria lógica que deveria estar sendo testada
it('should calculate total', () => {
  jest.spyOn(checkout, 'calculateTotal').mockReturnValue(540)
  // isso não testa nada útil
})
```

### Passo 4: testes E2E para os fluxos críticos

Não use E2E para tudo — é caro e lento. Use para os fluxos que, se quebrarem, causam mais dano:

```ts
// checkout.e2e.test.ts
describe('Checkout flow (E2E)', () => {
  it('should complete a purchase from cart to confirmation', async () => {
    const user = await createTestUser()
    const session = await loginAs(user)

    await session.addToCart([
      { productId: 'prod-1', quantity: 6 }
    ])

    const order = await session.checkout({
      paymentMethod: 'credit_card',
      address: testAddress
    })

    expect(order.status).toBe('confirmed')
    expect(order.discount).toBeGreaterThan(0)
  })
})
```

---

## O que faz um bom teste

Um teste bem escrito segue os princípios **FIRST**:

| Princípio | O que significa |
|---|---|
| **F**ast | Deve rodar em milissegundos. Testes lentos não são rodados. |
| **I**solated | Não deve depender do estado de outro teste. |
| **R**epeatable | Deve produzir o mesmo resultado independente do ambiente. |
| **S**elf-validating | Deve ter um `expect` claro — sem precisar inspecionar logs. |
| **T**imely | Escrito junto (ou antes) do código que testa. |

---

## Erros comuns para evitar

**Testar detalhes de implementação**
```ts
// ❌ frágil — qualquer refactor quebra o teste
expect(service._internalCache.size).toBe(1)

// ✅ robusto — testa o comportamento observável
expect(await service.getUser(1)).toEqual({ id: 1, name: 'Alice' })
```

**Nomenclatura vaga**
```ts
// ❌ não diz o que falhou
it('should work', () => { ... })

// ✅ auto-documentado
it('should return 404 when user does not exist', () => { ... })
```

**Setup gigante antes dos asserts**
Quando o `beforeEach` tem 50 linhas, ninguém sabe mais o que o teste está realmente verificando. Use **builders** ou **factories** para criar dados de teste de forma legível.

```ts
// ✅ com factory
const cart = cartFactory.withItems(6).withPricePerItem(100).build()
const total = calculateTotal(cart)
expect(total).toBe(540)
```

---

## Resumo

TDD não é sobre testes. É sobre **design guiado por comportamento esperado**.

- Comece pelo contrato (como será usado), não pela implementação
- Escreva o teste que falha antes de qualquer código
- Implemente o mínimo para passar — então refatore
- Use a pirâmide: muitos unitários, alguns de integração, poucos E2E
- Mocke dependências externas, não a lógica que você quer testar
- Nomeie seus testes como comportamentos, não como código

A disciplina de TDD parece lenta no começo. Mas é ela que permite que um projeto evolua por anos sem se tornar intocável.
