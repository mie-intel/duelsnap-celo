// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ICasualPool {
    function accrueRoyaltyBatch(
        address[] calldata contributors,
        uint256[] calldata amounts
    ) external payable;

    function pendingRoyalty(address contributor) external view returns (uint256);
}
