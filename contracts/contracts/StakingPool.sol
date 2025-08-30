// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract StakingPool is ReentrancyGuard, Ownable2Step, Pausable {
    using SafeERC20 for IERC20;

    struct UserInfo {
        uint256 balance;
        uint256 rewardDebt;
        uint256 lastStakeTime;
        uint256 lockExpiry;
    }

    // State variables
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    uint256 public rewardRate;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public startTime;
    uint256 public endTime;

    // Lock parameters
    uint256 public lockupDays;
    uint256 public boostMultiplier;
    uint256 public penaltyBps;

    mapping(address => UserInfo) public userInfo;
    uint256 public totalSupply;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event PoolPaused();
    event PoolUnpaused();

    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _lockupDays,
        uint256 _boostMultiplier,
        uint256 _penaltyBps
    ) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_rewardToken != address(0), "Invalid reward token");
        require(_startTime < _endTime, "Invalid time range");
        require(_boostMultiplier >= 10000, "Boost multiplier too low");
        require(_penaltyBps <= 10000, "Penalty too high");

        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
        startTime = _startTime;
        endTime = _endTime;
        lockupDays = _lockupDays;
        boostMultiplier = _boostMultiplier;
        penaltyBps = _penaltyBps;
        lastUpdateTime = block.timestamp;
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            userInfo[account].rewardDebt = earned(account);
        }
        _;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < endTime ? block.timestamp : endTime;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored +
            (((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18) / totalSupply);
    }

    function earned(address account) public view returns (uint256) {
        UserInfo storage user = userInfo[account];
        uint256 userRewardPerToken = rewardPerToken();

        uint256 earnedReward = (user.balance * userRewardPerToken) / 1e18 - user.rewardDebt;

        // Apply boost multiplier for locked stakes
        if (user.lockExpiry > block.timestamp) {
            earnedReward = (earnedReward * boostMultiplier) / 10000;
        }

        return earnedReward;
    }

    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        require(block.timestamp >= startTime, "Staking not started");
        require(block.timestamp < endTime, "Staking ended");

        UserInfo storage user = userInfo[msg.sender];

        // Update lock expiry if staking with lockup
        if (lockupDays > 0) {
            user.lockExpiry = block.timestamp + (lockupDays * 1 days);
        }

        user.balance += amount;
        user.lastStakeTime = block.timestamp;
        totalSupply += amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        UserInfo storage user = userInfo[msg.sender];
        require(user.balance >= amount, "Insufficient balance");

        uint256 penalty = 0;

        // Apply penalty for early withdrawal from locked stakes
        if (user.lockExpiry > block.timestamp && penaltyBps > 0) {
            penalty = (amount * penaltyBps) / 10000;
            uint256 penaltyAmount = (penalty * user.balance) / totalSupply;
            rewardToken.safeTransfer(owner(), penaltyAmount);
        }

        user.balance -= amount;
        totalSupply -= amount;

        stakingToken.safeTransfer(msg.sender, amount - penalty);
        emit Withdrawn(msg.sender, amount);
    }

    function claim() external nonReentrant updateReward(msg.sender) {
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            userInfo[msg.sender].rewardDebt = 0;
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function exit() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        uint256 balance = user.balance;
        require(balance > 0, "No balance to withdraw");

        uint256 reward = earned(msg.sender);

        // Apply penalty for early exit from locked stakes
        uint256 penalty = 0;
        if (user.lockExpiry > block.timestamp && penaltyBps > 0) {
            penalty = (balance * penaltyBps) / 10000;
            uint256 penaltyAmount = (penalty * balance) / totalSupply;
            rewardToken.safeTransfer(owner(), penaltyAmount);
        }

        user.balance = 0;
        user.rewardDebt = 0;
        totalSupply -= balance;

        stakingToken.safeTransfer(msg.sender, balance - penalty);
        if (reward > 0) {
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
        emit Withdrawn(msg.sender, balance);
    }

    // Admin functions
    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        updateReward(address(0));
        emit RewardRateUpdated(rewardRate, _rewardRate);
        rewardRate = _rewardRate;
    }

    function pause() external onlyOwner {
        _pause();
        emit PoolPaused();
    }

    function unpause() external onlyOwner {
        _unpause();
        emit PoolUnpaused();
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = stakingToken.balanceOf(address(this));
        stakingToken.safeTransfer(owner(), balance);
    }
}
