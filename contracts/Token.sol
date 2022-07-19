// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/TRC20.sol";
import "./lib/Owned.sol";
import "./lib/ISunswapV2Factory.sol";
import "./lib/ISunswapV2Router.sol";

/**
 * @title SimpleToken
 * @dev Very simple TRC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `TRC20` functions.
 */
contract Token is TRC20, Owned {

    uint256 private ADD_MULTIPLIER = 10;
    uint256 private DEL_MULTIPLIER = 1;
    uint private CURR_RESOURCE = 0;
    
    ISunswapV2Factory private factory = ISunswapV2Factory('TKWJdrQkqHisa1X8HUdHEfREvTzw4pMAaY');
    ISunswapV2Router01 private router = ISunswapV2Router01('TKWJdrQkqHisa1X8HUdHEfREvTzw4pMAaY');
    
    mapping(address => uint256) public staked;

    /**
     * @dev Constructor gives the creator 100 tokens to provide initial liquidity.
     */
    constructor () TRC20("Opensourced", "OPEN") {
        _mint(_msgSender(), 100 * (10 ** uint256(decimals())));
    }

    /**
     * @dev Reward a developer with tokens for making an opensource contribution.
     * @param developer The address to reward with tokens.
     * @param stars Number of stars of the repository the developer contributed to.
     * @param additions Number of additions in the commit.
     * @param deletions Number of deletions in the commit.
     */
    function rewardContribution(address developer, uint256 stars, uint256 additions, uint256 deletions) public virtual onlyOwner returns (bool) {
        _mint(developer, stars * (ADD_MULTIPLIER * additions + DEL_MULTIPLIER * deletions));
        return true;
    }

    /**
     * @dev Payable function to stake tokens.
     */
    function stake() external payable {
        stake('TTW663tQYJTTCtHh6DWKAfexRhPMf2DxQ1');
    }

    /**
     * @dev Helper function to stake tokens to a specific address.
     * @param representative The address of a representative to vote for.
     */
    function stake(address representative) internal {
        require(_msgValue() > 1 * 10 ** uint256(decimals())); // at least one TRX
        owner().freeze(_msgValue(), CURR_RESOURCE);
        if (CURR_RESOURCE == 0) {
            CURR_RESOURCE = 1; // swap resource being generated
        } else { CURR_RESOURCE = 0; }
        address[1] calldata votes = [representative];
        uint[1] calldata values = [_msgValue()];
        vote(votes, values);
        staked[_msgSender()] += _msgValue();
    }


    /**
     * @dev Unstake tokens to receive them back in your wallet.
     * @param amount Number of tokens to unstake.
     */
    function unstake(uint256 amount) external {
        require(amount > 1 * 10 ** uint256(decimals())); // at least one TRX
        require(amount <= staked[_msgSender()]); // can't unstake more than you have staked
        owner().unfreeze(0); // unstake bandwidth
        owner().unfreeze(1); // unstake energy
        staked[_msgSender()] -= _msgValue();
        transfer(_msgSender(), amount);
    }

    function withdraw() external {
        uint reward = withdrawreward();
        address pair = factory.getPair(address(0), address(1)) != address(0) ? factory.getPair(address(0), address(1)) : factory.createPair(', tokenB);;
    }

    /**
     * @dev Query the timestamp which the specific balance can be unfreezed.
     */
    function queryExpireTime(address payable target, uint res) external view returns(uint) {
        return target.freezeExpireTime(res);
    }
}