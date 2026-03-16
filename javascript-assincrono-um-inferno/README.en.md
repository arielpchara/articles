# JavaScript async is hell

JavaScript is, by nature, **single-threaded and synchronous** — it executes one instruction at a time, in the order they appear. So why all this talk about asynchrony?

The "trick" lies in the combination of three pieces:

- **Call Stack** — where JS code executes, synchronously
- **Web APIs / libuv** — browser or Node.js APIs that handle I/O (network, disk, timers) outside the JS engine
- **Event Loop** — monitors the call stack and task queues, pushing callbacks back for execution when the stack is empty

In other words: JavaScript code itself is not asynchronous, but it was designed to react to asynchronous operations from the environment. There's no escaping this, and the ways to deal with this model are: **callbacks**, **promises**, **async/await**, **generators**, and **observables**.

---

## Callbacks

A callback is when you pass as a parameter the function that will be executed when the asynchronous process finishes.

```js
function call(param, callback) {
  // implementation
  callback(param)
}

call('hello', (message) => {
  console.log(message)
})
```

Simple. But now look at what happens when the flow grows:

```js
// the callback hell

call('hello', (e, message) => {
  if(e) console.error(e)
  sendMessage(message, (e, status) => {
    if(e) console.error(e)
    processStatus(status, (e, processed) => {
      if(e) {
        cancelImplementation((e) => {
          if(e) console.error(e)
        })
        return
      }
      createNewFoo(processed, (e) => {
        if(e) console.error(e)
      })
    })
  })
})
```

This model turns into hell quickly: multiple nested closures that never end, variables with the same name that shadow each other, and with every call a new function instance is created — an overhead risk in flows that scale.

### Callbacks in functional style

Callbacks don't have to be written this way. In functional programming, everything is a function — and with currying we can compose the flow in a readable way:

```js
function call(callback) {
  // implementation
  return message => callback(message)
}

function sendMessage(callback) {
  return status => {
    // implementation
    callback(status)
  }
}

function processStatus(success, fail) {
  return status => {
    // implementation
    if(error) {
      return fail(error)
    }
    success(processed)
  }
}

const sendMessageToProcess = call(sendMessage(processStatus(createNewFoo, cancelImplementation)))

// every call starts an asynchronous process
sendMessageToProcess('hello')
```

Composition solves the nesting problem, but it demands discipline and familiarity with the functional style.

---

## Promises

A Promise is a generic pattern with a native implementation in JavaScript. Instead of receiving a callback, the function returns an object that represents the future result of the operation — and you chain what to do with that result via `.then()` and `.catch()`.

```js
function call(param) {
  return new Promise((resolve, reject) => {
    // implementation
    if(error) {
      return reject(error)
    }
    resolve(message)
  })
}

// simple usage
call('hello').then((message) => {
  console.log(message)
})

// chaining
call('hello')
  .then(sendMessage)
  .then(processStatus)
  .then(createNewFoo)
  .catch(cancelImplementation)
```

Chaining `.then()` solves the nesting problem and makes the flow linear and readable.

---

## Async/Await

`async/await` is syntactic sugar over Promises — under the hood, it's the same thing. The advantage is that the code looks even more like synchronous code, making it easier to read:

```js
async function run() {
  try {
    const message = await call('hello')
    const status = await sendMessage(message)
    const newFoo = await createNewFoo(status)
  } catch (e) {
    await cancelImplementation(e)
  }
}

run()
```

You look at it and think: "doesn't this look like structured PHP?" — and the answer is yes. That's the key point: **don't turn asynchronous code into sequential code unnecessarily**. If `sendMessage` and `processStatus` don't depend on each other, run them in parallel:

```js
function call(param) {
  return new Promise((resolve, reject) => {
    // implementation
    if(error) {
      return reject(error)
    }
    resolve(message)
  })
}

function sendMessage(message) {
  return new Promise(/*...*/)
}

function processStatus(message) {
  return new Promise(/*...*/)
}

async function run() {
  try {
    const message = await call('hello')
    // parallel execution — take advantage of asynchrony!
    const [processed, status] = await Promise.all([
      sendMessage(message),
      processStatus(message)
    ])
    const newFoo = await createNewFoo(processed, status)
  } catch (e) {
    cancelImplementation(e)
  }
}

run()
```

---

## Generators

Generators are functions that can **pause** and **resume** execution. Defined with `function*` and controlled with `yield`, they were the foundation that inspired `async/await`. They're less common day-to-day, but useful when you need to manually control the flow of asynchronous iterations or implement lazy pipelines:

```js
function* steps() {
  const message = yield call('hello')
  const status  = yield sendMessage(message)
  const newFoo  = yield createNewFoo(status)
  return newFoo
}

// a generic runner that executes the generator resolving each Promise
function run(generator) {
  const gen = generator()
  function step(value) {
    const { done, value: result } = gen.next(value)
    if(done) return Promise.resolve(result)
    return Promise.resolve(result).then(step)
  }
  return step()
}

run(steps)
```

Today, `async/await` covers most cases where generators would be used for asynchrony — but it's worth knowing the mechanism underneath.

---

## Observables (RxJS)

For continuous event streams — data streams, WebSockets, user input — Promises are not the right tool: they resolve **a single value** and terminate. Observables resolve **multiple values over time**.

```js
import { Subject, zip, from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

const callSubject = new Subject()

function call(message) {
  callSubject.next(message)
}

function sendMessage(message) {
  return from(/* async function */)
}

function processMessage(message) {
  return from(/* async function */)
}

function createFoo([statusMessage, processed]) {
  return from(/* async function */)
}

const process$ = callSubject.pipe(
  mergeMap(message => zip(
    sendMessage(message),
    processMessage(message)
  )),
  mergeMap(createFoo)
)

process$.subscribe((newFoo) => {
  console.log(newFoo)
})

call('hello')
```

See also a practical example here: https://github.com/arielpchara/rxjs-react

---

## Which one to use?

There's no silver bullet. Each approach has its place:

| Approach | When to use |
|---|---|
| **Callbacks** | Legacy APIs, simple libraries, or functional style with composition |
| **Promises** | Single operations with clear chaining |
| **Async/Await** | Sequential flows with dependencies between steps |
| **Promise.all** | Independent operations that can run in parallel |
| **Generators** | Pipelines with fine-grained iteration control |
| **Observables** | Event streams, multiple values over time |

Understand the purpose of your code, know the tools available, and choose the one that best balances readability, performance, and maintainability for your context.
