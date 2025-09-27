const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of Cricket Match Data contract...");

  // Get the ContractFactory and Signers
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy the contract
  const CricketMatchData = await ethers.getContractFactory("CricketMatchData");
  const cricketMatchData = await CricketMatchData.deploy();

  await cricketMatchData.deployed();

  console.log("CricketMatchData contract deployed to:", cricketMatchData.address);
  console.log("Contract deployed by:", deployer.address);
  console.log("Transaction hash:", cricketMatchData.deployTransaction.hash);

  // Verify the contract on Etherscan (if not on local network)
  if (network.name !== "localhost" && network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await cricketMatchData.deployTransaction.wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: cricketMatchData.address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Error verifying contract:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress: cricketMatchData.address,
    deployer: deployer.address,
    network: network.name,
    timestamp: new Date().toISOString(),
    transactionHash: cricketMatchData.deployTransaction.hash,
    blockNumber: cricketMatchData.deployTransaction.blockNumber,
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Test basic functionality
  console.log("\n=== Testing Basic Functionality ===");
  
  // Authorize a validator (in production, this would be done separately)
  console.log("Setting up initial configuration...");
  
  // Record a sample match
  const sampleMatch = await cricketMatchData.recordMatch(
    "TEST_MATCH_001",
    "Team A",
    "Team B", 
    300, // total balls
    5,   // no balls
    3,   // wide balls
    "Test Stadium"
  );
  
  console.log("Sample match recorded. Transaction hash:", sampleMatch.hash);
  
  const matchId = 1;
  const match = await cricketMatchData.getMatch(matchId);
  console.log("Sample match data:", {
    matchId: match.matchId.toString(),
    identifier: match.matchIdentifier,
    teams: `${match.team1} vs ${match.team2}`,
    totalBalls: match.totalBalls.toString(),
    noBalls: match.noBalls.toString()
  });

  console.log("\n=== Deployment Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });