# [Draft] Write beautify code with TDD 

Over my career as a coder I wrote a lot of shit code.
The way which I thought to apologies was changing my dedication to learn how to write better code, until finding the state of art in code pattern.

This is not my first try and not will be the last, the article it fallow explain how I changed my paradigm's to write my modules in JavaScript platforms (front and back) using TDD, the way I understand the TDD.


## Start by the end
Writing the code of how it will be called

Like this:
```js
// beautifulness.spec.js
const { createBeauty, theNameOf, withRealJewels, inCaseOfFireCall } = require('./beautifulness')

const helpMe = jest.fn()

// get methods from the factory with mastery
const {
  sayMyName,
  hasRealJewels,
  setFire,
  doSomething
} = createBeauty(
  // pass parameters an easy way
  theNameOf('Precious'),
  withRealJewels,
  inCaseOfFireCall(helpMe)
)

// Testing
it('Should say the name of Precious', () => {
  expect(sayMyName()).toEqual('My Name is Precious')
})
it('Should precious has jewels', () => {
  expect(hasRealJewels()).toEqual(true)
})
it('Should call helpMe method when set fire', () => {
  setFire('fire')
  expect(helpMe).toBeCalledWith('fire')
})
it('Should call helpMe method when doSomething', () => {
  doSomething()
  expect(helpMe).toBeCalledWith('fire')
})
```

Probably all these tests have gone fail, of course, I don't write the module yet.

## Writing the module



```js
function compose(...fns) {
  return fns.reduce((composed, fn) => {
    return fn(composed)
  }, {})
}

// INPUTS

// Add name key in config factory
function theNameOf(name) {
  return (config) => ({...config, name })
}

// Add hasJewel key in config factory
const withRealJewels = (config) => ({...config, hasJewel: true})

// Add event errorHandler in config factory
function inCaseOfFireCall(errorHandler) {
  return (config) => ({...config, errorHandler })
}

// OUTPUTS
// Get name property
function sayMyName(properties) {
  return () => `My Name is ${properties.name}`
}
// Get hasJewel property
function hasRealJewels(properties) {
  return () => properties.hasJewel
}
// Run errorHandler event
function setFire(properties) {
  return (err) => properties.errorHandler(err)
}

function doSomething(properties) {
  return (...args) => {
    try {
      get(...args)
    } catch (err) {
      properties.errorHandler(err)
    }
  } 
}


// FACTORY
function createBeauty(...configs) {
  return {
    sayMyName: compose(...configs, sayMyName),
    hasRealJewels: compose(...configs, hasRealJewels),
    setFire: compose(...configs, setFire),
    doSomething: compose(...configs, doSomething)
  }
}

// EXPORT FUNCTION
module.exports = {
  createBeauty,
  theNameOf,
  withRealJewels,
  inCaseOfFireCall
}
```

## Files

- [beautifulness.js](./beautifulness.js)
- [beautifulness.spec.js](./beautifulness.spec.js)