const B = require("big.js")
const { ethers } = require("hardhat")
const { utils } = ethers

module.exports.to18 = n => utils.parseEther(B(n).toFixed(0))

module.exports.from18 = utils.formatEther

module.exports.UINT_MAX = B(2).pow(256).sub(1).toFixed(0)

module.exports.deploy = async (contract, ...args) =>
  (await ethers.getContractFactory(contract)).deploy(...args)

module.exports.a = obj => obj.address
