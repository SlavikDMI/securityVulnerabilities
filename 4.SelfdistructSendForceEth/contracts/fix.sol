//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract FixEtherGame {
    uint public targetAmount = 7 ether;
    address public winner;
    uint public balance;



    function deposit() public payable {
        require(msg.value == 1 ether, "You can only send 1 Ether");

        balance += msg.value;
        require(balance <= targetAmount, "Game is over");

        if (balance == targetAmount) {
            winner = msg.sender;
        }
    }

    function claimReward() public {
        require(msg.sender == winner, "Not winner");
        balance = 0;
        winner = address(0);
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

   
}