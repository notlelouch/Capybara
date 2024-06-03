const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the NFT Contract
  const nftContract = await hre.ethers.deployContract("CapyNFT");
  await nftContract.waitForDeployment();
  console.log("CapyNFT deployed to:", nftContract.target);

  // Deploy the Fake Marketplace Contract
  const fakeNftMarketplaceContract = await hre.ethers.deployContract(
    "FakeNFTMarketplace"
  );
  await fakeNftMarketplaceContract.waitForDeployment();
  console.log(
    "FakeNFTMarketplace deployed to:",
    fakeNftMarketplaceContract.target
  );

  const deployerAddress = "0x31aaAC0090aE1590e0688eAa7192763556168D91"
  // Deploy the DAO Contract
  const amount = hre.ethers.parseEther(".02"); // You can change this value from 1 ETH to something else
  const daoContract = await hre.ethers.deployContract("CapyDAO", [
    fakeNftMarketplaceContract.target,
    nftContract.target,
    deployerAddress,
  ], {value: amount,});
  await daoContract.waitForDeployment();
  console.log("CapyDAO deployed to:", daoContract.target);

  // Sleep for 30 seconds to let Etherscan catch up with the deployments
  await sleep(30 * 1000);

  // Verify the Contracts
  await hre.run("verify:verify", {
    address: nftContract.target,
    constructorArguments: [],
  });

  // Verify the Fake Marketplace Contract
  await hre.run("verify:verify", {
    address: fakeNftMarketplaceContract.target,
    constructorArguments: [],
  });

  // Verify the DAO Contract
  await hre.run("verify:verify", {
    address: daoContract.target,
    constructorArguments: [
      fakeNftMarketplaceContract.target,
      nftContract.target,
      deployerAddress,
    ],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});