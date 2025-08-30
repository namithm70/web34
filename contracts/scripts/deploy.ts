import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DeFi contracts...");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy Mock ERC20 tokens for testing (only on testnets)
  const network = await ethers.provider.getNetwork();
  let stakingTokenAddress: string;
  let rewardTokenAddress: string;

  if (network.chainId === 31337 || network.chainId === 97) {
    // Deploy mock tokens on local/testnet
    const MockERC20 = await ethers.getContractFactory("MockERC20");

    const stakingToken = await MockERC20.deploy("Staking Token", "STAKE", ethers.parseEther("1000000"));
    await stakingToken.waitForDeployment();
    stakingTokenAddress = await stakingToken.getAddress();
    console.log("Mock Staking Token deployed to:", stakingTokenAddress);

    const rewardToken = await MockERC20.deploy("Reward Token", "REWARD", ethers.parseEther("1000000"));
    await rewardToken.waitForDeployment();
    rewardTokenAddress = await rewardToken.getAddress();
    console.log("Mock Reward Token deployed to:", rewardTokenAddress);
  } else {
    // Use real token addresses on mainnet
    stakingTokenAddress = process.env.STAKING_TOKEN_ADDRESS || "";
    rewardTokenAddress = process.env.REWARD_TOKEN_ADDRESS || "";
    if (!stakingTokenAddress || !rewardTokenAddress) {
      throw new Error("Token addresses not provided for mainnet deployment");
    }
  }

  // Deploy StakingPool
  const StakingPool = await ethers.getContractFactory("StakingPool");

  const rewardRate = ethers.parseEther("1"); // 1 token per second
  const startTime = Math.floor(Date.now() / 1000);
  const endTime = startTime + (365 * 24 * 60 * 60); // 1 year
  const lockupDays = 30;
  const boostMultiplier = 12000; // 1.2x boost
  const penaltyBps = 500; // 5% penalty

  const stakingPool = await StakingPool.deploy(
    stakingTokenAddress,
    rewardTokenAddress,
    rewardRate,
    startTime,
    endTime,
    lockupDays,
    boostMultiplier,
    penaltyBps
  );

  await stakingPool.waitForDeployment();
  const stakingPoolAddress = await stakingPool.getAddress();
  console.log("StakingPool deployed to:", stakingPoolAddress);

  // Deploy MasterChef
  const MasterChef = await ethers.getContractFactory("MasterChef");

  const rewardsPerSecond = ethers.parseEther("0.1"); // 0.1 token per second
  const bonusMultiplier = 2;
  const bonusEndTime = startTime + (30 * 24 * 60 * 60); // 30 days bonus

  const masterChef = await MasterChef.deploy(
    rewardTokenAddress,
    rewardsPerSecond,
    startTime,
    bonusMultiplier,
    bonusEndTime
  );

  await masterChef.waitForDeployment();
  const masterChefAddress = await masterChef.getAddress();
  console.log("MasterChef deployed to:", masterChefAddress);

  // Transfer reward tokens to contracts
  if (network.chainId === 31337 || network.chainId === 97) {
    const rewardToken = await ethers.getContractAt("MockERC20", rewardTokenAddress);

    // Transfer tokens to StakingPool
    await rewardToken.transfer(stakingPoolAddress, ethers.parseEther("10000"));
    console.log("Transferred reward tokens to StakingPool");

    // Transfer tokens to MasterChef
    await rewardToken.transfer(masterChefAddress, ethers.parseEther("10000"));
    console.log("Transferred reward tokens to MasterChef");
  }

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    stakingToken: stakingTokenAddress,
    rewardToken: rewardTokenAddress,
    stakingPool: stakingPoolAddress,
    masterChef: masterChefAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Write to file
  const fs = require("fs");
  fs.writeFileSync(
    `deployments/${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
