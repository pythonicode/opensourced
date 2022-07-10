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

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () TRC20("Test Token", "TT") {
        _mint(msg.sender, 10000000000 * (10 ** uint256(decimals())));
    }
}