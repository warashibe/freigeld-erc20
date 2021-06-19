const { expect } = require("chai")
const { to18, from18, UINT_MAX, deploy, a } = require("./utils")

describe("Freigeld", () => {
  let p1, p2, p3, ac
  beforeEach(async () => {
    ac = await ethers.getSigners()
    ;[p1, p2, p3] = ac
  })

  const check = async (...args) => {
    const [token, supply, interests, balances = []] = args
    expect(await token.totalSupply()).to.equal(supply)
    expect(await token.totalInterests()).to.equal(interests)
    for (const [p, balance] of balances) {
      expect(await token.balanceOf(a(p))).to.equal(balance)
    }
  }

  it("should deduct 10% per block", async () => {
    const token = await deploy("TestToken", "Freigeld", "Freigeld")
    await token.setRate(1, 10)
    await token.mint(a(p1), 100)
    await check(token, 100, 0, [[p1, 100]])
    await token.addBlock()
    await check(token, 90, 10, [[p1, 90]])
    await token.addBlock()
    await check(token, 80, 20, [[p1, 80]])
  })

  it("should handle multiple address with 10% deduction rate", async () => {
    const token = await deploy("TestToken", "Freigeld", "Freigeld")
    await token.setRate(1, 10)
    await token.mint(a(p1), 100)
    await check(token, 100, 0, [[p1, 100]])
    await token.mint(a(p2), 100)
    await check(token, 190, 10, [
      [p1, 90],
      [p2, 100],
    ])
    await token.mint(a(p3), 100)
    await check(token, 270, 30, [
      [p1, 80],
      [p2, 90],
      [p3, 100],
    ])
  })

  it("should burn and adjust the deduction rate", async () => {
    const token = await deploy("TestToken", "Freigeld", "Freigeld")
    await token.setRate(1, 10)
    await token.mint(a(p1), 100)
    await check(token, 100, 0, [[p1, 100]])
    await token.burn(50)
    await check(token, 40, 10, [[p1, 40]])
    await token.addBlock()
    await check(token, 36, 14, [[p1, 36]])
  })

  it("should transfer and adjust the deduction rate", async () => {
    const token = await deploy("TestToken", "Freigeld", "Freigeld")
    await token.setRate(1, 10)
    await token.mint(a(p1), 100)
    await check(token, 100, 0, [[p1, 100]])
    await token.transfer(a(p2), 50)
    await check(token, 90, 10, [
      [p1, 40],
      [p2, 50],
    ])
    await token.addBlock()
    await check(token, 81, 19, [
      [p1, 36],
      [p2, 45],
    ])
  })
})
