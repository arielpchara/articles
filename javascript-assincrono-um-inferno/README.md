# JavaScript assíncrono é um inferno

JavaScript é, por natureza, **single-threaded e síncrono** — ele executa uma instrução por vez, na ordem em que aparecem. Então por que toda essa conversa sobre assincronia?

O "truque" está na combinação de três peças:

- **Call Stack** — onde o código JS executa, de forma síncrona
- **Web APIs / libuv** — APIs do browser ou do Node.js que lidam com I/O (rede, disco, timers) fora da engine JS
- **Event Loop** — monitora a call stack e as filas de tarefas, empurrando callbacks de volta para execução quando a stack está livre

Ou seja: o código JavaScript em si não é assíncrono, mas ele foi projetado para reagir a operações assíncronas do ambiente. Não temos como fugir disso, e as formas de lidar com esse modelo são: **callbacks**, **promises**, **async/await**, **generators** e **observables**.

---

## Callbacks

Callback é quando você passa por parâmetro a função que será executada quando o processo assíncrono terminar.

```js
function call(param, callback) {
  // implementation
  callback(param)
}

call('hello', (message) => {
  console.log(message)
})
```

Simples. Mas agora veja o que acontece quando o fluxo cresce:

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

Esse modelo vira um inferno rapidamente: múltiplas closures aninhadas que não terminam, variáveis com o mesmo nome que se sobrepõem (shadowing), e a cada chamada uma nova instância de função é criada — risco de overhead em fluxos que escalam.

### Callbacks no estilo funcional

Callbacks não precisam ser escritos assim. Em programação funcional, tudo é uma função — e com currying podemos compor o fluxo de forma legível:

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

A composição resolve o aninhamento, mas exige disciplina e familiaridade com o estilo funcional.

---

## Promises

Promise é um padrão genérico com implementação nativa no JavaScript. Em vez de receber um callback, a função retorna um objeto que representa o resultado futuro da operação — e você encadeia o que fazer com esse resultado via `.then()` e `.catch()`.

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

// uso simples
call('hello').then((message) => {
  console.log(message)
})

// encadeamento
call('hello')
  .then(sendMessage)
  .then(processStatus)
  .then(createNewFoo)
  .catch(cancelImplementation)
```

O encadeamento de `.then()` resolve o problema do aninhamento e torna o fluxo linear e legível.

---

## Async/Await

`async/await` é açúcar sintático sobre Promises — por baixo dos panos, é a mesma coisa. A vantagem é que o código fica ainda mais parecido com código síncrono, facilitando a leitura:

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

Aí você olha e pensa: "isso não parece PHP estruturado?" — e a resposta é sim. Esse é o ponto de atenção: **não transforme código assíncrono em código sequencial desnecessariamente**. Se `sendMessage` e `processStatus` não dependem um do outro, execute-os em paralelo:

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
    // execução paralela — aproveite a assincronia!
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

Generators são funções que podem **pausar** e **retomar** a execução. Definidas com `function*` e controladas com `yield`, elas foram a base que inspirou o `async/await`. São menos comuns no dia a dia, mas úteis quando você precisa controlar manualmente o fluxo de iterações assíncronas ou implementar pipelines lazy:

```js
function* steps() {
  const message = yield call('hello')
  const status  = yield sendMessage(message)
  const newFoo  = yield createNewFoo(status)
  return newFoo
}

// um runner genérico que executa o generator resolvendo cada Promise
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

Hoje em dia `async/await` cobre a maioria dos casos onde generators seriam usados para assincronia — mas vale conhecer o mecanismo por baixo.

---

## Observables (RxJS)

Para fluxos de eventos contínuos — streams de dados, WebSockets, input do usuário — Promises não são a ferramenta certa: elas resolvem **um único valor** e encerram. Observables resolvem **múltiplos valores ao longo do tempo**.

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

Veja também um exemplo prático aqui: https://github.com/arielpchara/rxjs-react

---

## Qual usar?

Não existe a forma maravilhosa. Cada abordagem tem seu lugar:

| Abordagem | Quando usar |
|---|---|
| **Callbacks** | APIs legadas, bibliotecas simples, ou estilo funcional com composição |
| **Promises** | Operações únicas com encadeamento claro |
| **Async/Await** | Fluxos sequenciais com dependência entre etapas |
| **Promise.all** | Operações independentes que podem rodar em paralelo |
| **Generators** | Pipelines com controle fino de iteração |
| **Observables** | Streams de eventos, múltiplos valores no tempo |

Entenda o propósito do seu código, conheça as ferramentas disponíveis, e escolha a que melhor equilibra legibilidade, performance e manutenibilidade para o seu contexto.

