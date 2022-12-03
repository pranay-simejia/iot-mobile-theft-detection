const LostMobileList = artifacts.require('./LostMobileList.sol')

contract('LostMobileList', (accounts) => {
  before(async () => {
    this.lostMobileList = await LostMobileList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.lostMobileList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('Add Lost Mobile', async () => {
    const result = await this.lostMobileList.addLostMobile('123','8000991143','Krishna')
    const lostMobileCount = await this.lostMobileList.lostMobileCount()
    assert.equal(lostMobileCount, 1)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1)
    assert.equal(event.IMEI, '123')
    assert.equal(event.mobileNumber, '8000991143')
    assert.equal(event.location, 'Krishna')
  })
  it('Edit Lost Mobile', async () => {
    const result = await this.lostMobileList.editLostMobile('123','9352375847','Gandhi')
    const lostMobileCount = await this.lostMobileList.lostMobileCount()
    assert.equal(lostMobileCount, 1)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1)
    assert.equal(event.IMEI, '123')
    assert.equal(event.mobileNumber, '9352375847')
    assert.equal(event.location, 'Gandhi')
  })
  it('Remove Lost Mobile', async () => {
    const result = await this.lostMobileList.removeLostMobile('123')
    const lostMobileCount = await this.lostMobileList.lostMobileCount()
    assert.equal(lostMobileCount, 0)
    const event = result.logs[0].args
    // assert.equal(event.id.toNumber(), 1)
    assert.equal(event.IMEI, '123')
    // assert.equal(event.mobileNumber, '8000991143')
    // assert.equal(event.location, 'Krishna')
  })

})