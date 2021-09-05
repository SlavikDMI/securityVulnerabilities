// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const EXPL1 = await hre.ethers.getContractFactory("expl1");
  const VULN1 = await hre.ethers.getContractFactory("contracts/vuln1.sol:vuln1");

  const expl1 = await EXPL1.deploy();
  await expl1.deployed();
  const vuln1 = await VULN1.deploy();
  await vuln1.deployed();

  console.log("expl1 deployed to:", expl1.address);
  console.log("vuln1 deployed to:", vuln1.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
