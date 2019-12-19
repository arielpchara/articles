function compose(...fns) {
  return fns.reduce((composed, fn) => {
    return fn(composed)
  }, {})
}

function sayMyName(beauty) {
  return () => `My Name is ${beauty.name}`
}

function hasRealJewels(beauty) {
  return () => beauty.hasJewel
}

function setFire(beauty) {
  return (err) => beauty.errorHandler(err)
}

function createBeauty(...configs) {
  return {
    sayMyName: compose(...configs, sayMyName),
    hasRealJewels: compose(...configs, hasRealJewels),
    setFire: compose(...configs, setFire)
  }
}

function theNameOf(name) {
  return (config) => ({...config, name })
}

const withRealJewels = (config) => ({...config, hasJewel: true})

function inCaseOfFireCall(errorHandler) {
  return (config) => ({...config, errorHandler })
}

module.exports = {
  createBeauty,
  theNameOf,
  withRealJewels,
  inCaseOfFireCall
}