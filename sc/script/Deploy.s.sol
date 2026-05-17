// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../src/QuestionPool.sol";
import "../src/CasualPool.sol";
import "../src/GameSession.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        address relayer = vm.envOr("RELAYER_ADDRESS", deployer);
        address treasury = deployer;

        vm.startBroadcast(deployerKey);

        // QuestionPool
        QuestionPool questionPoolImpl = new QuestionPool();
        address questionPool = address(new ERC1967Proxy(
            address(questionPoolImpl),
            abi.encodeCall(QuestionPool.initialize, (deployer))
        ));
        console2.log("QuestionPool proxy: ", questionPool);

        // CasualPool (native CELO, reads contributor from QuestionPool)
        CasualPool casualPoolImpl = new CasualPool();
        address payable casualPool = payable(address(new ERC1967Proxy(
            address(casualPoolImpl),
            abi.encodeCall(CasualPool.initialize, (deployer, treasury, questionPool))
        )));
        console2.log("CasualPool proxy:   ", casualPool);

        // GameSession (native CELO)
        GameSession gameSessionImpl = new GameSession();
        address payable gameSession = payable(address(new ERC1967Proxy(
            address(gameSessionImpl),
            abi.encodeCall(GameSession.initialize, (deployer, treasury, questionPool))
        )));
        console2.log("GameSession proxy:  ", gameSession);

        // Grant roles
        QuestionPool(questionPool).grantRole(QuestionPool(questionPool).VERIFIER_ROLE(), relayer);
        QuestionPool(questionPool).grantRole(QuestionPool(questionPool).GAME_ROLE(), relayer);
        GameSession(gameSession).grantRole(GameSession(gameSession).RELAYER_ROLE(), relayer);

        // Wire GameSession ↔ CasualPool
        CasualPool(casualPool).grantRole(CasualPool(casualPool).GAME_SESSION_ROLE(), gameSession);
        GameSession(gameSession).setCasualPool(casualPool);

        vm.stopBroadcast();

        console2.log("\n--- .env.local (copy-paste) ---");
        console2.log(string.concat("NEXT_PUBLIC_QUESTION_POOL_ADDRESS=", vm.toString(questionPool)));
        console2.log(string.concat("NEXT_PUBLIC_CASUAL_POOL_ADDRESS=",   vm.toString(casualPool)));
        console2.log(string.concat("NEXT_PUBLIC_GAME_SESSION_ADDRESS=",  vm.toString(gameSession)));
    }
}
