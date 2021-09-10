//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8;

contract Auction {
    address payable public currentLeader;
    uint public highestBid;


    function bid() public payable {
        require(msg.value > highestBid);

        require(currentLeader.send(highestBid)); 
        currentLeader = payable(msg.sender);
        highestBid = msg.value;
    }
}