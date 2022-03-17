// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "ds-test/test.sol";
import "../contracts/Whitelistooor.sol";
import "./CheatCodes.sol";

contract WhitelistooorTest is DSTest {
    address public _owner;
    uint8 public whitelistedAddressMax;
    uint8 public numCurrentlyWhitelisted;
    address[] public allWhitelisted;

    mapping(address => bool) public whitelisted;

    Whitelistooor public whitelistContract;
    CheatCodes cheats = CheatCodes(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    modifier onlyOwner() {
        require(_owner == msg.sender, "You are not the owner");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    function setUp() public {
        // Initialize whitelist with 5 max spots
        whitelistContract = new Whitelistooor(5);
    }

    function testNumCurrentlyWhitelisted() public onlyOwner {
        assertEq(numCurrentlyWhitelisted, 0);
        whitelistContract.addToWhitelist(_owner);
        assertEq(whitelistContract.numCurrentlyWhitelisted(), 1);
        whitelistContract.removeFromWhitelist(_owner);
        assertEq(numCurrentlyWhitelisted, 0);
    }

    function testWhitelistedAddressMax() public {
        assertEq(whitelistContract.whitelistedAddressMax(), 5);
    }
}
