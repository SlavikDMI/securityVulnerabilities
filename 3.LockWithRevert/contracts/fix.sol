//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8;

contract Auction {
    address owner;
    address payable public currentLeader;
    uint public highestBid;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function bid() public payable {
        require(msg.value > highestBid);

        require(currentLeader.send(highestBid)); 
        currentLeader = payable(msg.sender);
        highestBid = msg.value;
    }

    function changeSettings(address payable newLeader, uint newHighestBid) public onlyOwner {
        currentLeader = newLeader;
        highestBid = newHighestBid;
    }
}