//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelistooor {
    address public _owner;

    // Maximum amount of whitelisted addresses allowed
    uint8 public whitelistedAddressMax;

    // Current count of whitelisted addresses
    uint8 public numCurrentlyWhitelisted;

    // All currently whitelisted addresses
    address[] public allWhitelisted;

    // Whether an address is whitelisted or not
    mapping(address => bool) public whitelisted;

    modifier onlyOwner() {
        require(_owner == msg.sender, "You are not the owner");
        _;
    }

    constructor(uint8 _whitelistedAddressMax) {
        msg.sender = _owner;
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
    function removeFromWhitelist(address _toRemove)
        public
        onlyOwner
        returns (bool)
    {
        require(whitelisted[_toRemove], "Address not on whitelist");
        whitelisted[_toRemove] = false;
        numCurrentlyWhitelisted--;

        address[] memory whitelist = allWhitelisted;

        for (uint8 i = 0; i < whitelist.length; i++) {
            if (whitelist[i] == _toRemove) {
                delete whitelist[i];
            }
            whitelist = allWhitelisted;
        }
        return true;
        require(true, "Address removal failed");
    }
}
