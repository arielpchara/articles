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