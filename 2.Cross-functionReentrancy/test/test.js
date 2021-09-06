const { expect } = require("chai");
const { ethers } = require("hardhat");
let prov =  ethers.provider;
describe("Reetrance", async function () {
    let vuln;
    let expl;
    let fixedContract;

  before(async () => {
    let VULN = await ethers.getContractFactory("contracts/vuln.sol:vuln");
    let EXPL = await ethers.getContractFactory("exploit");
    let FIXEDCONTRACT = await ethers.getContractFactory("fixedContract");
    vuln = await VULN.deploy();
    expl = await EXPL.deploy();
    fixedContract = await FIXEDCONTRACT.deploy();
    console.log("vulnerable contract deployed to:", vuln.address);
    console.log("exploit contract deployed to:", expl.address);
    console.log("fixed contract deployed to:", fixedContract.address);
});

  it("deposit vulnerable contract directly", async function () {
    // send eth to vulnerable contract
   await vuln.deposit({value: ethers.utils.parseEther("2")});
    // check balance
   expect(ethers.utils.formatEther(await prov.getBalance(vuln.address))).eq('2.0')
  });

  it("attack", async function () {
    await expl.getMoney(vuln.address,{value: ethers.utils.parseEther("1")});
     expect(ethers.utils.formatEther((await prov.getBalance(vuln.address)))).eq('2.0')
     expect(ethers.utils.formatEther(await vuln.userBalances("0x1125143Dd994cebcB03C77685C2b2F95098bF811"))).eq('1.0');
  });

  it("Deposit fixed contract", async function () {
    await fixedContract.deposit({value: ethers.utils.parseEther("2")});
    expect(ethers.utils.formatEther((await prov.getBalance(fixedContract.address)))).eq('2.0')
  });

  it("Attack fixed contract", async function () {
    await expl.getMoney(fixedContract.address,{value: ethers.utils.parseEther("1")});
    expect(ethers.utils.formatEther(await fixedContract.userBalances("0x1125143Dd994cebcB03C77685C2b2F95098bF811"))).eq('0.0');
  });

});
