// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;


contract fixedContract {
    mapping (address => uint) public userBalances;

function withdrawBalance() public {
    uint amountToWithdraw = userBalances[msg.sender];
    // FIX
    userBalances[msg.sender] = 0;
    (bool success, ) = msg.sender.call{value:amountToWithdraw}(""); // At this point, the caller's code is executed, and can call withdrawBalance again
    require(success);
}

function deposit() external payable {
    userBalances[msg.sender] += msg.value ;
}

}