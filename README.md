# Capybara: An NFT-Powered Fully On-Chain DAO

This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](/packages/create-rainbowkit).

Capybara is a decentralized autonomous organization (DAO) designed to enable members to collectively invest in NFT collections. The DAO operates entirely on-chain, leveraging smart contracts to automate the creation and execution of investment proposals. Members of Capybara can propose NFT purchases, vote on these proposals, and the DAO automatically executes successful proposals using its treasury.

## Features

- **Decentralized Governance:** Members propose and vote on governance decisions.

- **NFT-Based Membership:** Membership and voting power are based on the ownership of specific NFTs.
- **Automated NFT Marketplace Integration:** Proposals to purchase NFTs are executed automatically if approved by a majority vote.
- **Custom NFT Collection:** A basic NFT contract is used to mint NFTs for the DAO members.
- **Web Interface:** A Next.js-based frontend allows users to interact with the DAO easily.

## Prerequisites
- Solidity
- Hardhat
- MetaMask wallet
- QuickNode account
- Etherscan account

## Setup

### Clone the repository to your local machine

   ```bash
    git clone https://github.com/yourusername/capybara-dao.git
    cd capybara-dao
   ```
### Set Up Environment Variables

  Create a .env file in contracts directory:
  
   ```bash
    PRIVATE_KEY="..."
    QUICKNODE_RPC_URL="..."
    ETHERSCAN_API_KEY="..."
   ```
  PRIVATE_KEY: Exported from MetaMask.
  QUICKNODE_RPC_URL: QuickNode HTTP Provider link.  
  ETHERSCAN_API_KEY: Etherscan API key.

### Deploy the contracts

  Deploy the smart contracts to your preferred network
  ps:- I have used sepolia test network
  ```bash
    npx hardhat run scripts/deploy.js --network your-network
   ```
Take note of the deployed contract addresses, as you'll need them for the frontend configuration.

## Frontend setup

### Define Constants

Edit the file named constants.ts in the root directory and add the necessary contract addresses and ABIs:

```bash
export const CapyNFTAddress = "REPLACE_WITH_YOUR_CONTRACT_ADDRESS";
export const FakeNFTMarketplaceAddress = "REPLACE_WITH_YOUR_CONTRACT_ADDRESS";
export const CapyDAOAddress = "REPLACE_WITH_YOUR_CONTRACT_ADDRESS";

export const CapyNFTABI = []; // REPLACE THIS WITH THE NFT CONTRACT ABI
export const FakeNFTMarketplaceABI = []; // REPLACE THIS WITH THE FAKE MARKETPLACE ABI
export const CapyDAOABI = []; // REPLACE THIS WITH THE DAO ABI
```
Replace the placeholders with the actual contract addresses and ABI content from the JSON files located in hardhat/artifacts/contracts/<Contract Name>.sol.

### Install the Dependencies and run the Development Server

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.


To learn more about this stack, take a look at the following resources:

- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.


## License
This project is licensed under the MIT License.

## Contributing

Contributions are welcome! If you have ideas for improvements, new features, or bug fixes, please open an issue or submit a pull request.
