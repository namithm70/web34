// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MasterChef is ReentrancyGuard, Ownable2Step, Pausable {
    using SafeERC20 for IERC20;

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
    }

    struct PoolInfo {
        IERC20 lpToken;
        uint256 allocPoint;
        uint256 lastRewardTime;
        uint256 accRewardPerShare;
    }

    // State variables
    IERC20 public immutable rewardToken;
    uint256 public rewardsPerSecond;
    uint256 public bonusMultiplier;
    uint256 public bonusEndTime;

    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    uint256 public totalAllocPoint = 0;
    uint256 public startTime;
    uint256 public lastRewardTime;

    // Events
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event RewardPaid(address indexed user, uint256 indexed pid, uint256 amount);

    constructor(
        address _rewardToken,
        uint256 _rewardsPerSecond,
        uint256 _startTime,
        uint256 _bonusMultiplier,
        uint256 _bonusEndTime
    ) {
        require(_rewardToken != address(0), "Invalid reward token");
        require(_bonusMultiplier >= 1, "Invalid bonus multiplier");

        rewardToken = IERC20(_rewardToken);
        rewardsPerSecond = _rewardsPerSecond;
        startTime = _startTime;
        bonusMultiplier = _bonusMultiplier;
        bonusEndTime = _bonusEndTime;
        lastRewardTime = block.timestamp > startTime ? block.timestamp : startTime;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function add(uint256 _allocPoint, address _lpToken) external onlyOwner {
        require(_lpToken != address(0), "Invalid LP token");

        massUpdatePools();

        uint256 lastRewardTime = block.timestamp > startTime ? block.timestamp : startTime;
        totalAllocPoint += _allocPoint;

        poolInfo.push(PoolInfo({
            lpToken: IERC20(_lpToken),
            allocPoint: _allocPoint,
            lastRewardTime: lastRewardTime,
            accRewardPerShare: 0
        }));
    }

    function set(uint256 _pid, uint256 _allocPoint) external onlyOwner {
        require(_pid < poolInfo.length, "Invalid pool");

        massUpdatePools();

        totalAllocPoint = totalAllocPoint - poolInfo[_pid].allocPoint + _allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        if (_to <= bonusEndTime) {
            return (_to - _from) * bonusMultiplier;
        } else if (_from >= bonusEndTime) {
            return _to - _from;
        } else {
            return (bonusEndTime - _from) * bonusMultiplier + (_to - bonusEndTime);
        }
    }

    function pendingReward(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];

        uint256 accRewardPerShare = pool.accRewardPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));

        if (block.timestamp > pool.lastRewardTime && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardTime, block.timestamp);
            uint256 reward = multiplier * rewardsPerSecond * pool.allocPoint / totalAllocPoint;
            accRewardPerShare = accRewardPerShare + (reward * 1e12 / lpSupply);
        }

        return (user.amount * accRewardPerShare / 1e12) - user.rewardDebt;
    }

    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.timestamp <= pool.lastRewardTime) {
            return;
        }

        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardTime = block.timestamp;
            return;
        }

        uint256 multiplier = getMultiplier(pool.lastRewardTime, block.timestamp);
        uint256 reward = multiplier * rewardsPerSecond * pool.allocPoint / totalAllocPoint;

        pool.accRewardPerShare = pool.accRewardPerShare + (reward * 1e12 / lpSupply);
        pool.lastRewardTime = block.timestamp;
    }

    function deposit(uint256 _pid, uint256 _amount) external nonReentrant whenNotPaused {
        require(_pid < poolInfo.length, "Invalid pool");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);

        if (user.amount > 0) {
            uint256 pending = (user.amount * pool.accRewardPerShare / 1e12) - user.rewardDebt;
            if (pending > 0) {
                safeRewardTransfer(msg.sender, pending);
                emit RewardPaid(msg.sender, _pid, pending);
            }
        }

        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(msg.sender, address(this), _amount);
            user.amount += _amount;
        }

        user.rewardDebt = user.amount * pool.accRewardPerShare / 1e12;
        emit Deposit(msg.sender, _pid, _amount);
    }

    function withdraw(uint256 _pid, uint256 _amount) external nonReentrant {
        require(_pid < poolInfo.length, "Invalid pool");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "Withdraw amount exceeds balance");

        updatePool(_pid);

        uint256 pending = (user.amount * pool.accRewardPerShare / 1e12) - user.rewardDebt;
        if (pending > 0) {
            safeRewardTransfer(msg.sender, pending);
            emit RewardPaid(msg.sender, _pid, pending);
        }

        if (_amount > 0) {
            user.amount -= _amount;
            pool.lpToken.safeTransfer(msg.sender, _amount);
        }

        user.rewardDebt = user.amount * pool.accRewardPerShare / 1e12;
        emit Withdraw(msg.sender, _pid, _amount);
    }

    function emergencyWithdraw(uint256 _pid) external nonReentrant {
        require(_pid < poolInfo.length, "Invalid pool");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;

        pool.lpToken.safeTransfer(msg.sender, amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    function safeRewardTransfer(address _to, uint256 _amount) internal {
        uint256 rewardBal = rewardToken.balanceOf(address(this));
        if (_amount > rewardBal) {
            rewardToken.safeTransfer(_to, rewardBal);
        } else {
            rewardToken.safeTransfer(_to, _amount);
        }
    }

    // Admin functions
    function setRewardsPerSecond(uint256 _rewardsPerSecond) external onlyOwner {
        massUpdatePools();
        rewardsPerSecond = _rewardsPerSecond;
    }

    function setBonusMultiplier(uint256 _bonusMultiplier, uint256 _bonusEndTime) external onlyOwner {
        require(_bonusMultiplier >= 1, "Invalid bonus multiplier");
        bonusMultiplier = _bonusMultiplier;
        bonusEndTime = _bonusEndTime;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyRewardWithdraw(uint256 _amount) external onlyOwner {
        require(_amount <= rewardToken.balanceOf(address(this)), "Insufficient reward balance");
        rewardToken.safeTransfer(owner(), _amount);
    }
}
