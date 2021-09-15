const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils")
let prov =  ethers.provider;

describe("LockWithRever", function () {
  let etherGame;
  let exploit, exploit2;
  let signers;
  let fixGame;

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

  it("Users deposit 6 eth", async () => {
    await etherGame.connect(signers[0]).deposit({value: parseEther('1')});
    await etherGame.connect(signers[1]).deposit({value: parseEther('1')});
    await etherGame.connect(signers[0]).deposit({value: parseEther('1')});
    await etherGame.connect(signers[1]).deposit({value: parseEther('1')});
    await etherGame.connect(signers[0]).deposit({value: parseEther('1')});
    await etherGame.connect(signers[1]).deposit({value: parseEther('1')});
    expect(formatEther(await prov.getBalance(etherGame.address))).eq('6.0')
  })

>
  it("EthGame balance after exploit selfdestruct is 13ETH", async () => {
    await exploit.attack(etherGame.address, {value: parseEther('7')});
    expect(formatEther(await prov.getBalance(etherGame.address))).eq('13.0')
  })


  it('Cant withdraw', async () => {
     expect(etherGame.connect(signers[0]).claimReward()).to.be.reverted;
     expect(etherGame.connect(signers[1]).claimReward()).to.be.reverted;
  })

  it('Cant deposit', async () => {
    expect(etherGame.connect(signers[0]).deposit({value: parseEther('1')})).to.be.reverted;
  })


  it('Now work with fixed contract. Users deposit 6 eth to contract', async() => {
    await fixGame.connect(signers[0]).deposit({value: parseEther('1')});
    await fixGame.connect(signers[1]).deposit({value: parseEther('1')});
    await fixGame.connect(signers[0]).deposit({value: parseEther('1')});
    await fixGame.connect(signers[1]).deposit({value: parseEther('1')});
    await fixGame.connect(signers[0]).deposit({value: parseEther('1')});
    await fixGame.connect(signers[1]).deposit({value: parseEther('1')});
    expect(formatEther(await prov.getBalance(fixGame.address))).eq('6.0')
})



  it('Attack fixed contract. Send 7Eth, using selfdestruct', async() => {
    await exploit2.attack(fixGame.address, {value: parseEther('7')});
     expect(formatEther(await prov.getBalance(fixGame.address))).eq('13.0')
  })

  it('User can deposit! And become winner', async () => {
    await fixGame.connect(signers[1]).deposit({value: parseEther('1')});
    expect(await fixGame.winner()).eq(signers[1].address);
  })

  it('Claim bonus', async () => {
    await fixGame.connect(signers[1]).claimReward();
    expect(formatEther(await prov.getBalance(fixGame.address))).eq('0.0')
  })

  
})