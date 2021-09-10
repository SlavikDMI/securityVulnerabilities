const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils")


describe("LockWithRever", function () {
  let auction;
  let exploit;
  let signers;
  
  before(async () => {
    signers = await ethers.getSigners();
    const Auction = await ethers.getContractFactory("contracts/vuln.sol:Auction");
    const Exploit = await ethers.getContractFactory("Exploit");
    const FixExploit = await ethers.getContractFactory("contracts/fix.sol:Auction");
    auction = await Auction.deploy();
    exploit = await Exploit.deploy();
    fixAuction = await FixExploit.deploy();
    await auction.deployed();
    await exploit.deployed();
    await fixAuction.deployed();

  });

  it("After deploy, HighestBid is zero", async () => {
    let highestBid = (await auction.highestBid()).toNumber();
    expect(highestBid).eq(0);
  });

  it("Make Bid and currentLeader is our address", async () => {
    await auction.bid({value: parseEther("1")});
    let highestBid = formatEther(await auction.highestBid());
    let currentLeader = await auction.currentLeader();
    expect(highestBid).eq('1.0');
    expect(currentLeader).eq(signers[0].address)
  });

  it("Lock vulnerable contract, using exploit contract", async () => {
    await exploit.attack(auction.address, {value: parseEther("2")});
    let currentLeader = await auction.currentLeader();
    expect(currentLeader).eq(exploit.address);
  });

  it("Nobody make bid, because tx is reverting", async () => {
    await expect( auction.bid({value: parseEther("3")})).to.be.reverted;
  });

  
});
