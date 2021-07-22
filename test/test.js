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
      [p2, 99],
    ])
    await token.mint(a(p3), 100)
    await check(token, 271, 29, [
      [p1, 81],
      [p2, 90],
      [p3, 99],
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
      [p2, 49],
    ])
    await token.addBlock()
    await check(token, 81, 19, [
      [p1, 36],
      [p2, 44],
    ])
  })

  it("should consist the burn rate", async () => {
    const token = await deploy("TestToken", "Freigeld", "Freigeld")
    await token.setRate(1, 10)
    await token.mint(a(p1), 100)
    await check(token, 100, 0, [[p1, 100]])
    await token.addBlock()
    await check(token, 90, 10, [[p1, 90]])
    await token.mint(a(p2), 100)
    await check(token, 180, 20, [
      [p1, 80],
      [p2, 100],
    ])
    await token.addBlock()
    await check(token, 162, 38, [
      [p1, 72],
      [p2, 90],
    ])
    await token.addBlock()
    await check(token, 144, 56, [
      [p1, 64],
      [p2, 80],
    ])
    await token.burn(40)
    await check(token, 86, 74, [
      [p1, 16],
      [p2, 69],
    ])
    await token.addBlock()
    await check(token, 78, 82, [
      [p1, 14],
      [p2, 63],
    ])
    await token.addBlock()
    await check(token, 69, 91, [
      [p1, 12],
      [p2, 56],
    ])
    await token.addBlock()
    await token.addBlock()
    await token.addBlock()
    await token.addBlock()
    await token.addBlock()
    await check(token, 26, 134, [
      [p1, 4],
      [p2, 21],
    ])
    await token.addBlock()

    await check(token, 18, 142, [
      [p1, 3],
      [p2, 14],
    ])
  })

  it("should reset when supply becomes 0", async () => {
    const token = await deploy("TestToken", "Freigeld", "Freigeld")
    await token.setRate(1, 2)
    await token.mint(a(p1), 100)
    await check(token, 100, 0, [[p1, 100]])
    await token.mint(a(p2), 100)
    await check(token, 150, 50, [
      [p1, 50],
      [p2, 100],
    ])
    await token.addBlock()
    await token.addBlock()
    await check(token, 0, 200, [
      [p1, 0],
      [p2, 0],
    ])
    await token.mint(a(p1), 100)
    await check(token, 100, 200, [
      [p1, 100],
      [p2, 0],
    ])
    await token.addBlock()
    await check(token, 50, 250, [
      [p1, 50],
      [p2, 0],
    ])
    await token.mint(a(p2), 100)
    await check(token, 100, 300, [
      [p1, 0],
      [p2, 100],
    ])
  })
})
