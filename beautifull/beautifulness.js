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