//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelistooor is Ownable {
    // Maximum amount of whitelisted addresses allowed
    uint8 public whitelistedAddressMax;

    // Current count of whitelisted addresses
    uint8 public numCurrentlyWhitelisted;

    // All currently whitelisted addresses
    address[] public allWhitelisted;

    // Whether an address is whitelisted or not
    mapping(address => bool) public whitelisted;

    constructor(uint8 _whitelistedAddressMax) {
        msg.sender = owner();
        whitelistedAddressMax = _whitelistedAddressMax;
    }

    // Add an address to the whitelist
    function addToWhitelist(address _toWhitelist) public onlyOwner {
        // Don't add if they're already on whitelist
        require(!whitelisted[_toWhitelist], "Address already on the whitelist");
        // Check to make sure there are whitelist spots available
        require(
            numCurrentlyWhitelisted < whitelistedAddressMax,
            "Whitelist is full"
        );

        // Add to whitelist
        whitelisted[_toWhitelist] = true;
        allWhitelisted.push(_toWhitelist);
        numCurrentlyWhitelisted++;
    }

    // Remove an address from the whitelist
    function removeFromWhitelist(address _toRemove) public onlyOwner {
        require(whitelisted[_toRemove], "Address not on whitelist");
        whitelisted[_toRemove] = false;
        numCurrentlyWhitelisted--;

        allWhitelisted memory whitelist;
        for (uint8 i = 0; i < whitelist.length; i++) {
            if (whitelist[i] == _toRemove) {
                whitelist.splice(i, 1);
            }
        }
        return whitelist;
    }
}
