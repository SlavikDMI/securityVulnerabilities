// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;


contract vuln {
    mapping (address => uint) public userBalances;

function transfer(address to, uint amount) public {
    if (userBalances[msg.sender] >= amount) {
       userBalances[to] += amount;
       userBalances[msg.sender] -= amount;
    }
}

function withdrawBalance() public {
    uint amountToWithdraw = userBalances[msg.sender];
    (bool success, ) = msg.sender.call{value:amountToWithdraw}(""); 
    require(success);
    userBalances[msg.sender] = 0;
}

function deposit() external payable {
    userBalances[msg.sender] += msg.value ;
}


}