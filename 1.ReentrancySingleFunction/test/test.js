const { expect } = require("chai");
//const { ethers } = require("ethers");
const { parseEther, formatEther } = require("ethers/lib/utils")
let prov =  ethers.provider;
describe("Reetrance", async function () {
    let vuln;
    let expl;
    let fixedContract;

  before(async () => {
    let VULN = await ethers.getContractFactory("contracts/vuln.sol:vuln");
    let EXPL = await ethers.getContractFactory("contracts/expl1.sol:expl1");
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
   await vuln.deposit({value: parseEther("2")});
    // check balance
   expect(formatEther(await prov.getBalance(vuln.address))).eq('2.0')
  });

  it("attack", async function () {
    await expl.getMoney(vuln.address,{value: parseEther("1")});
    expect(formatEther(await prov.getBalance(vuln.address))).eq('0.0')
    expect(formatEther(await prov.getBalance(expl.address))).eq('0.0')
  });

  it("Deposit fixed contract", async function () {
    await fixedContract.deposit({value: parseEther("2")});
    expect(formatEther(await prov.getBalance(fixedContract.address))).eq('2.0')
  });

  it("Attack fixed contract", async function () {
    await expect(expl.getMoney(fixedContract.address,{value: parseEther("1")})).to.be.reverted;
    expect(formatEther(await prov.getBalance(fixedContract.address))).eq('2.0')
  });

});
