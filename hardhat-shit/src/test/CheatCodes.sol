// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface CheatCodes {
    // Sets the *next* call's msg.sender to be the input address
    function prank(address) external;

    // Sets all subsequent calls' msg.sender to be the input address until `stopPrank` is called
    function startPrank(address) external;

    // Resets subsequent calls' msg.sender to be `address(this)`
    function stopPrank() external;

    function expectRevert(bytes calldata) external;
}
