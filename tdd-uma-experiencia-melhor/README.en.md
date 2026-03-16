# Maybe you need a better experience with TDD

Inspired by an article I read about the overvaluation of unit tests, I decided to write this text to share my point of view on automated tests — unit, integration, or end-to-end — and how the order in which you think about them changes everything.

This text aims to show an implementation journey, applying techniques I believe to be good testing practices.

## Before we start: order matters

There's a very common habit in teams: write the code first and the tests later. That seems reasonable — after all, you need the code to test it, right?

The problem is that tests written after the fact tend to validate the implementation you created, not the behavior you needed. You shape the tests to cover the code that exists — not to define the contract that should have existed.

TDD inverts that order. You write the test first, and the code is born to satisfy it.

The cycle has three steps — **Red → Green → Refactor**:
- **Red** — write a failing test. It defines what you want.
- **Green** — write the minimum code to make the test pass.
- **Refactor** — improve the code without breaking the tests.

The discipline is in respecting all three. Especially not skipping the "minimum code" part and jumping straight to an elaborate solution.

There are also a few ideas floating around about TDD that are worth clearing up before we go further:

"TDD is about code coverage" — it's not. 100% coverage doesn't mean the tests are useful.
"Unit tests are the most important" — not necessarily. A unit test that mocks everything can pass 100% while the whole system is broken.
"TDD is slow" — it's slower at the start of a feature. It's much faster when you need to change that feature six months later.

## The testing pyramid

Before getting into the journeys, it's worth aligning where each type of test fits.

```
        /\
       /  \
      / E2E \        ← few, slow, expensive
     /--------\
    /Integration\    ← moderate
   /--------------\
  /   Unit Tests   \ ← many, fast, cheap
 /------------------\
```

Each layer has a different role:
- **Unit** — test isolated logic of a function or module. Fast, easy to maintain.
- **Integration** — test collaboration between parts. One module calling another, real I/O.
- **E2E** — test the complete user flow. Slow and expensive to maintain.

The most common mistake is inverting this pyramid: few unit tests, no integration, everything in E2E. The result is a slow, brittle suite that, when it breaks, doesn't tell you where the problem is.

## Scenario

The project has several products, and one team per product.
There is a strong need to reuse code across all products.
Each team specializes in solving business problems.
There is a team that specializes in solving technical problems for all the other teams.
The libraries created must have a high level of trust.
Documentation and consistency in the use of the libraries are essential for these technical products.

Let's split these examples into two journeys:
  - Tool development (libraries)
  - Product development

## Tool development journey (libraries)

This team's goal is to build a technological structure to receive the needs of the product (business), so anticipating those needs is an important characteristic.

The "clients" of this product will be the other developers on the project, and just like any client, they need to trust that the product does what it promises. For that to happen, a good explanation of the tool is essential — documentation and usage guides.

So whoever is developing must first figure out how the implementation will be done.

**How to solve the contract first:**

1. A good starting point is those libraries you admire and enjoy using.
2. Write pre-documentation of how you'd like to use this library, here's an example:

```js
// how to use
import { createConnector } from '@company/tools'

// simple connection
const connector = createConnector({
  uri: 'http://localhost:3000'
})

async function use() {
  const data = await connector.getData('/users')
  console.log(data)
}
```

This documentation will most likely evolve, but it will help you focus on the problem to be solved in a more objective way. The function names, the parameters, what it returns — all of that becomes clear before you open an implementation file.

### Now the test journey begins

Since you already have the function signature, turn that documentation into tests. The test doesn't know about the implementation — it only knows the contract you just defined:

```ts
// connector.test.ts
import { createConnector } from '@company/tools'

describe('createConnector', () => {
  it('returns data from the given endpoint', async () => {
    const connector = createConnector({ uri: 'http://localhost:3000' })

    const data = await connector.getData('/users')

    expect(data).toEqual([{ id: 1, name: 'Alice' }])
  })

  it('throws an error when the endpoint is unreachable', async () => {
    const connector = createConnector({ uri: 'http://nonexistent-host' })

    await expect(connector.getData('/users')).rejects.toThrow()
  })

  it('respects the configured timeout', async () => {
    const connector = createConnector({ uri: 'http://slow-server', timeout: 100 })

    await expect(connector.getData('/users')).rejects.toThrow(/timeout/i)
  })
})
```

These tests will fail — and that's expected. That's the **Red** of the cycle.

Now write the minimum to make them pass (**Green**):

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

The tests pass. Now it's time for **Refactor** — extract constants, improve types, organize better — without breaking anything.

### The integration test closes the contract

The unit tests above can use a mock server. But for an infrastructure library, you want at least one test that uses a real connection — to make sure the contract works for real, not just in simulation:

```ts
// connector.integration.test.ts
import { createConnector } from '@company/tools'
import { startMockServer, stopMockServer } from './test-helpers'

describe('connector — integration', () => {
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

Unit tests cover the logic. Integration tests cover the glue between the parts.

## Product development journey

The product team solves business problems. Here TDD has a different flavor: you're not defining an API for other developers — you're implementing rules that exist in someone's head (PO, stakeholder, user).

**How to solve the contract first:**

Before opening the editor, ask: what does this code need to do? Write the tests in behavioral language — not implementation language:

```ts
// checkout.test.ts
describe('Checkout', () => {
  it('applies a 10% discount when the cart has more than 5 items', () => {
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

  it('does not apply discount when the cart has 5 or fewer items', () => {
    const cart = createCart([
      { product: 'A', price: 100 },
      { product: 'B', price: 100 },
    ])

    const total = calculateTotal(cart)

    expect(total).toBe(200)
  })

  it('applies free shipping when the total after discount exceeds 500', () => {
    const cart = createCart([/* 6 items at 100 each */])

    const result = checkout(cart)

    expect(result.shippingCost).toBe(0)
  })
})
```

Notice: the tests describe business rules, not implementation. If the PO changes the rule from 5 to 10 items, you update the test and the implementation follows.

Now the implementation guided by the tests:

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

### When to mock and when not to

One of the biggest points of confusion in product tests is overusing mocks. The practical rule is simple:
- Mock **external dependencies** (APIs, databases, third-party services)
- **Don't mock** the business logic you're testing

```ts
// ✅ correct — mock the external dependency, real logic
it('saves the order after checkout', async () => {
  const mockRepository = { save: jest.fn().mockResolvedValue({ id: 'order-123' }) }
  const service = new OrderService(mockRepository)

  const result = await service.placeOrder(cart)

  expect(mockRepository.save).toHaveBeenCalledWith(
    expect.objectContaining({ total: 540 })
  )
  expect(result.id).toBe('order-123')
})

// ❌ wrong — mocking the very logic that should be tested
it('calculates the total', () => {
  jest.spyOn(checkout, 'calculateTotal').mockReturnValue(540)
  // this tests nothing useful
})
```

### E2E for the flows that matter most

Don't use E2E for everything — it's expensive and slow. Use it for the flows that, if they break, cause the most damage:

```ts
// checkout.e2e.test.ts
it('completes a purchase from cart to confirmation', async () => {
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

## Things that make a test worth writing

A few habits that make a real difference day to day:

**Name as behavior, not as code**
```ts
// ❌ doesn't say what failed
it('should work', () => { ... })

// ✅ self-documenting
it('returns 404 when the user does not exist', () => { ... })
```

**Don't test implementation details**
```ts
// ❌ fragile — any refactor breaks it
expect(service._internalCache.size).toBe(1)

// ✅ robust — tests what's observable
expect(await service.getUser(1)).toEqual({ id: 1, name: 'Alice' })
```

**Use factories to build test data**

When `beforeEach` has 50 lines, nobody knows what the test is actually verifying anymore. Factories fix that:

```ts
// ✅ readable, no noise
const cart = cartFactory.withItems(6).withPricePerItem(100).build()
const total = calculateTotal(cart)
expect(total).toBe(540)
```

## To wrap up

TDD is not about tests. It's about design guided by the behavior you want to see.

Start from the contract — how it will be used, not how it will be implemented.
Write the failing test before any code.
Implement the minimum to pass, then refactor.
Use the pyramid: many unit tests, some integration, few E2E.
Name tests as behaviors, not as lines of code.

The discipline of TDD feels slower at first. But it's what allows a project to evolve for years without becoming untouchable.
