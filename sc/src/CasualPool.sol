// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IQuestionPool.sol";

/// @notice Handles paid casual game fees using native CELO. 90% → contributors, 10% → treasury.
contract CasualPool is AccessControlUpgradeable, ReentrancyGuard, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant GAME_SESSION_ROLE = keccak256("GAME_SESSION_ROLE");

    address public treasury;
    IQuestionPool public questionPool;

    mapping(address => uint256) public pendingRoyalty;

    uint256 public constant FEE_AMOUNT = 0.01 ether;
    uint256 public constant CONTRIBUTOR_BPS = 9000;
    uint256 public constant TREASURY_BPS = 1000;

    error NothingToWithdraw(address contributor);
    error InvalidQuestionIds();
    error LengthMismatch();
    error WrongFee(uint256 sent, uint256 expected);
    error TransferFailed(address to, uint256 amount);

    event CasualFeePaid(address indexed player, uint256 amount, uint256[] questionIds);
    event RoyaltyAccumulated(address indexed contributor, uint256 amount);
    event RoyaltyWithdrawn(address indexed contributor, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin, address _treasury, address _questionPool) external initializer {
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        treasury = _treasury;
        questionPool = IQuestionPool(_questionPool);
    }

    function payAndPlay(uint256[] calldata questionIds) external payable nonReentrant {
        if (questionIds.length == 0) revert InvalidQuestionIds();
        if (msg.value != FEE_AMOUNT) revert WrongFee(msg.value, FEE_AMOUNT);

        uint256 totalForContributors = (FEE_AMOUNT * CONTRIBUTOR_BPS) / 10000;
        uint256 forTreasury = FEE_AMOUNT - totalForContributors;
        uint256 perQuestion = totalForContributors / questionIds.length;
        uint256 distributed = 0;

        for (uint256 i = 0; i < questionIds.length; i++) {
            (, address contrib, , , , , ) = questionPool.questions(questionIds[i]);
            if (contrib != address(0)) {
                pendingRoyalty[contrib] += perQuestion;
                distributed += perQuestion;
                emit RoyaltyAccumulated(contrib, perQuestion);
            }
        }

        uint256 dust = totalForContributors - distributed;
        _sendETH(treasury, forTreasury + dust);

        emit CasualFeePaid(msg.sender, FEE_AMOUNT, questionIds);
    }

    function withdrawRoyalty() external nonReentrant {
        uint256 amount = pendingRoyalty[msg.sender];
        if (amount == 0) revert NothingToWithdraw(msg.sender);
        pendingRoyalty[msg.sender] = 0;
        _sendETH(msg.sender, amount);
        emit RoyaltyWithdrawn(msg.sender, amount);
    }

    /// @notice Accrue royalty into escrow. Caller (GameSession) sends ETH with this call.
    function accrueRoyaltyBatch(
        address[] calldata contributors,
        uint256[] calldata amounts
    ) external payable onlyRole(GAME_SESSION_ROLE) {
        if (contributors.length != amounts.length) revert LengthMismatch();
        uint256 total = 0;
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 amount = amounts[i];
            if (contributor == address(0) || amount == 0) continue;
            pendingRoyalty[contributor] += amount;
            total += amount;
            emit RoyaltyAccumulated(contributor, amount);
        }
        // Excess ETH (dust) goes to treasury
        if (msg.value > total) {
            _sendETH(treasury, msg.value - total);
        }
    }

    function distributeRoyalties(address[] calldata contributors) external onlyRole(ADMIN_ROLE) {
        for (uint256 i = 0; i < contributors.length; i++) {
            address contrib = contributors[i];
            uint256 amount = pendingRoyalty[contrib];
            if (amount == 0) continue;
            pendingRoyalty[contrib] = 0;
            _sendETH(contrib, amount);
            emit RoyaltyWithdrawn(contrib, amount);
        }
    }

    function _sendETH(address to, uint256 amount) internal {
        if (amount == 0) return;
        (bool ok, ) = to.call{value: amount}("");
        if (!ok) revert TransferFailed(to, amount);
    }

    receive() external payable {}

    function _authorizeUpgrade(address) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
