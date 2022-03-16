// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "ds-test/test.sol";
import "src/contracts/Whitelistooor.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WhitelistooorTest is Ownable, DSTest {
    uint8 public whitelistedAddressMax;
    uint8 public numCurrentlyWhitelisted;
    address[] public allWhitelisted;
    mapping(address => bool) public whitelisted;
    Whitelistooor whitelistContract;

    constructor() {
        msg.sender = owner();
    }

    function setUp() public {
        // Initialize whitelist with 5 max spots
        whitelistContract = new Whitelistooor(5);
    }

    function testNumCurrentlyWhitelisted(address addy) public {
        assertEq(numCurrentlyWhitelisted, 0);
        whitelistContract.addToWhitelist(addy);
        assertEq(numCurrentlyWhitelisted, 1);
        whitelistContract.addToWhitelist(addy);
        assertEq(numCurrentlyWhitelisted, 2);
    }

    function testWhitelistedAddressMax() public {
        assertEq(whitelistContract.whitelistedAddressMax(), 5);
    }

    function testFailWhitelistedAddressMax(address addy) public {
        whitelistContract.addToWhitelist(addy); // 1st
        whitelistContract.addToWhitelist(addy); // 2nd
        whitelistContract.addToWhitelist(addy); // 3rd
        whitelistContract.addToWhitelist(addy); // 4th
        whitelistContract.addToWhitelist(addy); // 5th
        whitelistContract.addToWhitelist(addy); // 6th address added, should revert
    }
}
