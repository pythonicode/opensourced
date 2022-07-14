// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/TRC20.sol";
import "./lib/Owned.sol";

/**
 * @title SimpleToken
 * @dev Very simple TRC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `TRC20` functions.
 */
contract Token is TRC20, Owned {

    uint256 private ADD_MULTIPLIER = 1;
    uint256 private DEL_MULTIPLIER = 1;
    uint private CURR_RESOURCE = 0;

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () TRC20("Opensourced", "OPEN") {
        // 100 tokens of intial liquidity supplied to token creator.
        _mint(_msgSender(), 100 * (10 ** uint256(decimals())));
    }

    function rewardContribution(address developer, uint256 stars, uint256 additions, uint256 deletions) public virtual onlyOwner returns (bool) {
        _mint(developer, stars * (ADD_MULTIPLIER * additions + DEL_MULTIPLIER * deletions));
        return true;
    }

    function stake() public payable {
        
    }

    function stake(address representative) public payable {
        require(_msgValue() > 1 * 10 ** uint256(decimals())); // at least one TRX
        re.freeze(_msgValue(), CURR_RESOURCE);
        if (CURR_RESOURCE == 0) {
            CURR_RESOURCE = 1; // swap resource being generated
        } else { CURR_RESOURCE = 0; }
        address[1] calldata votes = [representative];
        uint[1] calldata values = [_msgValue()];
        vote(votes, values);
    }

    function unstake(uint res) public {
        require(_msgValue() > 1 * 10 ** uint256(decimals())); // at least one TRX
        address(this).unfreeze(0); // unstake bandwidth
        address(this).unfreeze(1); // unstake energy
    }
}