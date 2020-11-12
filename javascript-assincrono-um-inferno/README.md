# JavaScript assíncrono é um inferno
A forma como o JavaScript lê o código é uma realidade e não temos como fugir disso, é assíncrono e ponto final.
E as formas de lidar com isso são: callbacks, promises, generators e observables.
Callback é quando você passa por parâmetro a função que vai ser executada quando o processo assíncrono terminar.
Promise é uma pattern genérica mas que possui uma implementação pronta em JavaScript, que retorna um objeto que executam as funções que passadas pelo método `then`
Exemplos de callback:


```js
function call(param, callback) {
  // implemntation
  callback(param)
}

call('hello', (message) => {
  console.log(message)
})

// the hell!!!!

call('hello', (message) => {
  sendMessage(message, (e, status) => {
    if(err) console.error(e)
    processStatus(status, (e, parocessed) => {
      if(e) {
        cancelImplementation((e) => {
           if(e) console.error(e)
        })
      }
      createNewFoo((e) => {
        if(e) console.error(e)
      })
    })
  })
})
```

Veja no exemplo quando esse modelo vira um inferno, são múltiplas closures blocos de função que não terminam, variáveis com mesmo nome que se sobrepõem, e por último, caso a função escale será criado uma instância de função para cada chamada de callback.
Para isso é indicado usar Promise, veja um exemplo:

```js
function call(param) {
  return new Promise((resolve, reject) => {
    // implementation
    if(error) {
      return reject(error)
    }
    resolve()
  })
}

call('hello').then((message) => {
  console.log(message)
})


// god, but

call('hello')
  .then(sendMessage)
  .then(processStatus)
  .then(createNewFoo)
  .catch(cancelImplementation)


// so

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

Mas aí você veja o último exemplo, não te lembra alguma coisa que começa com PH e termina com P (estruturado)?
E onde fica o aquela coisa bacanuda de funcional ?
Tive um papo recentemente sobre isso, e meu entendimento era de que muito disso passa por uma questão de estilo de programação, e o JavaScript com sua característica de multi-paradigma, gera esses discussões sobre melhor forma.
Mas não é tudo existem limitações razoáveis para se ver em cada formato.
Usando callback existe o risco de overhead, de complexidade, shadowing entre outros riscos, mas se é do estilo escrever o código alguns cuidados devem ser tomados, lembrando que programação funcional tudo é uma função.

```js
function call(callback) {
  // implementation
  return message => callback(status)
}

function sendMessage(callback) {
  // implementation
  return status => {
    // implementation
    callback(parocessed)
  }
} 

function processStatus(success, fail) {
    return status => {
    // implementation
    if(error){
      return fail(error)
    }
    success(parocessed)
  }
}
  
const sendMessaToProcess = call(sendMessage(processStatus(createNewFoo, cancelImplementation))

// every call start a asyncronous process
sendMessaToProcess('hello')
```

Ou quando usamos promises ou async//await, o ponto de atenção é você não encher de await fazendo seu código um bloco estruturado, assincronia é bom e devemos utilizar-la.

```js
function call(param) {
  return new Promise((resolve, reject) => {
    // implementation
    if(error) {
      return reject(error)
    }
    resolve()
  })
}

function sendMessage(message) {
  return new Promise(/*...*/)
}

function processStatus(message) {
  return new Promise(/*...*/)
}

try {
  const message = call('hello')
  // parallel
  const [processed, status] = Promise.all([sendMessage(message), processStatus(message)])
  const newFoo = createNewFoo(processed, status)
} catch (e) {
  cancelImplementation(e)
}
```

O plus é que não precisamos trabalhar apenas com a pattern Promise no JS, existe uma outra forma de trabalho utilizando Observables, ou seja, a lib RXJS, segue um exemplo.

```js
import {Subject, from, zip} from 'rxjs'
import {from, mergeMap, map} from 'rxjs/operators'

const callSubject = new Subject()

function call(message) {
  callSubject.next(message)
}

function sendMessage(message) {
  // syncronous code
  return from(/* async function */)
}

function processMessage(message) {
  // syncronous code
  return from(/* async function  */)
}

function createFoo([statusMessage, processed]) {
  // syncronous code
  return from(/* async function  */)
}

const process$ = callSubject.pipe(
  mergeMap(
    zip(
      [
        sendMessage,
        processMessage
      ]
    )
  ),
  mergeMap(createFoo)
)

process$.subscribe((newFoo) => {
  console.log(newFoo)
})

call('hello')
```

Veja também um exemplo aqui https://github.com/arielpchara/rxjs-react

Mas para resumir não existe uma forma maravilhosa de se resolver as coisas, entenda qual é o propósito do seu código e equalize com a forma que você melhor sabe utilizar.

