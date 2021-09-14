const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils")
let prov =  ethers.provider;

describe("LockWithRever", function () {
  let etherGame;
  let exploit, exploit2;
  let signers;
  
  before(async () => {
    signers = await ethers.getSigners();
    const EtherGame = await ethers.getContractFactory("EtherGame");
    const Exploit = await ethers.getContractFactory("Exploit");
    const FixGame = await ethers.getContractFactory("FixEtherGame");
    etherGame = await EtherGame.deploy();
    exploit = await Exploit.deploy();
    exploit2 = await Exploit.deploy();
    fixGame = await FixGame.deploy();
    await etherGame.deployed();
    await exploit.deployed();
    await fixGame.deployed();

  });

  it("EthGame balance after exploit selfdestruct is 7ETH", async () => {
    await exploit.attack(etherGame.address, {value: parseEther('7')});
     expect(formatEther(await prov.getBalance(etherGame.address))).eq('7.0')
  })

  it('Cant withdraw from another address', async () => {
     expect(etherGame.claimReward()).to.be.reverted;
  })

  it('Cant deposit from another address', async () => {
    expect(etherGame.deposit({value: parseEther('1')})).to.be.reverted;
  })

  it('Attack fixed contract. Send 7Eth, using selfdestruct', async() => {
    await exploit2.attack(fixGame.address, {value: parseEther('7')});
     expect(formatEther(await prov.getBalance(fixGame.address))).eq('7.0')
  })

  it('Cant deposit from another address', async () => {
    expect(fixGame.deposit({value: parseEther('1')})).to.be.reverted;
  })

  it('After call softReset, balance of game contract is 0', async () => {
    await fixGame.softReset();
    expect(formatEther(await prov.getBalance(fixGame.address))).eq('0.0')
  })
})