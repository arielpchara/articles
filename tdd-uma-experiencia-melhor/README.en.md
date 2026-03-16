# TDD: a better experience

Inspired by an article I read about the overvaluation of unit tests, I want to share my perspective on automated testing — unit, integration, and end-to-end — and how **the order in which you think about tests changes everything**.

This is not about code coverage. It's about a way of working that uses tests to guide design, increase confidence, and make evolving code far less scary.

---

## The problem with "writing tests after"

Most teams write code first, tests later. That seems reasonable — after all, you need the code to test it, right?

The problem is that tests written after the fact tend to test **the implementation** you created, not **the behavior** you needed. You shape the tests to cover existing code, not to define the contract that should have existed.

TDD inverts that order: **you write the test first, and the code is born to satisfy it**.

The cycle is simple — it's called **Red → Green → Refactor**:

1. **Red** — write a failing test. It defines the expected behavior.
2. **Green** — write the minimum code to make the test pass.
3. **Refactor** — improve the code without breaking the tests.

Nothing more. The discipline is in respecting the three steps — especially not skipping the "minimum code" part and jumping straight to an elaborate solution.

---

## Common misconceptions

**"TDD is about code coverage"**
It's not. 100% coverage doesn't mean the tests are useful. A test that verifies `add(2, 2)` returns `4` covers the line but doesn't guarantee business behavior.

**"Unit tests are the most important"**
Not necessarily. A unit test that mocks everything except the function under test can pass 100% while the system as a whole is still broken. The **testing pyramid** exists to balance this.

**"TDD is slow"**
TDD is slower at the start of a feature. It's much faster when you need to change that feature six months later.

**"I need to test every line"**
You need to test **behaviors**, not lines. If a behavior is covered by multiple code paths, one well-written test can cover all of them.

---

## The testing pyramid

```
        /\
       /  \
      / E2E \        ← few, slow, expensive — test the whole system
     /--------\
    /Integration\    ← moderate — test collaboration between parts
   /--------------\
  /   Unit Tests   \ ← many, fast, cheap — test isolated behavior
 /------------------\
```

Each layer has a different role:

| Type | What it tests | Speed | Maintenance cost |
|---|---|---|---|
| **Unit** | Isolated logic of a function/class | Very fast | Low |
| **Integration** | Collaboration between modules, real I/O | Moderate | Moderate |
| **E2E** | Complete user flow | Slow | High |

The common mistake is **inverting the pyramid**: few unit tests, no integration, and trusting everything to E2E. The result is a slow, brittle test suite that doesn't tell you where the problem is when it breaks.

---

## The scenario

To keep this concrete, let's work in a real context:

> A project with multiple products and teams. There's a strong need to share code across products. One team specializes in technical infrastructure — they build libraries used by the other teams. These libraries need a high level of trust, good documentation, and a consistent API.

Two journeys:
- **Tool development (libraries)**
- **Product development (business features)**

---

## Journey 1: tool development (libraries)

The infrastructure team builds tools for other teams. Their "clients" are developers — and like any client, they need to trust that the tool does what it promises.

### Step 1: the contract comes first

Before writing any implementation, define how the library will be **used**. Write the usage documentation before the code exists:

```ts
// how to use — written before any implementation
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

This exercise forces you to think about **API ergonomics** before any implementation decision. Function names, parameters, return values — all of it becomes clear here.

### Step 2: tests define the contract

Now transform that documentation into tests. The test knows nothing about the implementation — it only knows the contract you just defined:

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

**These tests will fail.** That's expected — it's the **Red** of the cycle.

### Step 3: minimum implementation to pass (Green)

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

Tests pass. Now it's time for **Refactor** — extract constants, improve names, add more expressive types — without breaking the tests.

### Step 4: integration tests to verify the real contract

The unit tests above may use a mock server. But for an infrastructure library, you want at least one integration test that uses a real connection:

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

The rule is clear: **unit tests cover logic, integration tests cover the glue between parts**.

---

## Journey 2: product development (business features)

The product team solves business problems. Here TDD has a different flavor: you're not defining an API for other developers — you're implementing rules that exist in someone's head (PO, stakeholder, user).

### Step 1: start from the expected behavior

Before opening the editor, ask: **what does this code need to do?** Write the tests in behavioral language:

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

Notice: the tests describe **business rules**, not implementation. If the PO changes the rule from 5 to 10 items, you update the test and the implementation follows.

### Step 2: implementation guided by tests

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

### Step 3: when to mock and when not to

One of the biggest sources of confusion in product tests is overuse of mocks.

**Practical rule:**
- Mock **external dependencies** (APIs, databases, third-party services)
- **Don't mock** the business logic you're testing

```ts
// ✅ correct — mock the external dependency, real logic
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

// ❌ wrong — mocking the logic you should actually be testing
it('should calculate total', () => {
  jest.spyOn(checkout, 'calculateTotal').mockReturnValue(540)
  // this tests nothing useful
})
```

### Step 4: E2E tests for critical flows

Don't use E2E for everything — it's expensive and slow. Use it for flows that, if broken, cause the most damage:

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

## What makes a good test

A well-written test follows the **FIRST** principles:

| Principle | What it means |
|---|---|
| **F**ast | Must run in milliseconds. Slow tests don't get run. |
| **I**solated | Must not depend on the state of another test. |
| **R**epeatable | Must produce the same result regardless of environment. |
| **S**elf-validating | Must have a clear `expect` — no need to inspect logs. |
| **T**imely | Written alongside (or before) the code it tests. |

---

## Common mistakes to avoid

**Testing implementation details**
```ts
// ❌ fragile — any refactor breaks the test
expect(service._internalCache.size).toBe(1)

// ✅ robust — tests observable behavior
expect(await service.getUser(1)).toEqual({ id: 1, name: 'Alice' })
```

**Vague naming**
```ts
// ❌ doesn't say what failed
it('should work', () => { ... })

// ✅ self-documenting
it('should return 404 when user does not exist', () => { ... })
```

**Giant setup before assertions**
When `beforeEach` has 50 lines, nobody knows what the test is actually verifying. Use **builders** or **factories** to create test data in a readable way:

```ts
// ✅ with factory
const cart = cartFactory.withItems(6).withPricePerItem(100).build()
const total = calculateTotal(cart)
expect(total).toBe(540)
```

---

## Summary

TDD is not about tests. It's about **design guided by expected behavior**.

- Start from the contract (how it will be used), not the implementation
- Write the failing test before any code
- Implement the minimum to pass — then refactor
- Use the pyramid: many unit tests, some integration, few E2E
- Mock external dependencies, not the logic you want to test
- Name your tests as behaviors, not as code

The discipline of TDD feels slow at first. But it's what allows a project to evolve for years without becoming untouchable.
