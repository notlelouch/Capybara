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

### 1. Clone the repository to your local machine

   ```bash
    git clone https://github.com/yourusername/capybara-dao.git
    cd capybara-dao
   ```
### 2. Set Up Environment Variables

  Create a .env file in foundry-app:
  
   ```bash
    PRIVATE_KEY="..."
    QUICKNODE_RPC_URL="..."
    ETHERSCAN_API_KEY="..."
   ```
  PRIVATE_KEY: Exported from MetaMask.
  QUICKNODE_RPC_URL: QuickNode HTTP Provider link.  
  ETHERSCAN_API_KEY: Etherscan API key.

### 3. Deploy the Whitelist Contract

  Load environment variables:

  ```bash
    source .env
   ```
  Deploy the contract:
  ```bash
    forge create --rpc-url $QUICKNODE_RPC_URL --private-key $PRIVATE_KEY --constructor-args 10 --etherscan-api-key $ETHERSCAN_API_KEY --verify src/Whitelist.sol:Whitelist
```

### 4. Add Users to the Whitelist

Interact with the deployed contract on Etherscan:

- Go to Sepolia Etherscan.
- Search for your contract address.
- Under the "Contract" tab, go to "Write Contract".
- Connect your wallet.
- Call `addAddressToWhitelist`.

### 5. Deploy the NFT Contract

Deploy the CryptoDevs contract:

```bash
forge create --rpc-url $QUICKNODE_RPC_URL --private-key $PRIVATE_KEY --constructor-args <Whitelist Contract Address> --etherscan-api-key $ETHERSCAN_API_KEY --verify src/CryptoDevs.sol:CryptoDevs
```
Replace <Whitelist Contract Address> with your actual Whitelist contract address.

### 6. Test Whitelisted Mint

- Open the NFT contract on Sepolia Etherscan.
- Go to the "Write Contract" tab.
- Connect your wallet.
- Call mint with payableAmount as 0.

### 7. Test Non-Whitelisted Mint

- Switch to a non-whitelisted account.
- Connect your wallet on Etherscan.
- Call mint with payableAmount as 0.01.

## License
This project is licensed under the MIT License.

## Contributing

Contributions are welcome! If you have ideas for improvements, new features, or bug fixes, please open an issue or submit a pull request.


This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](/packages/create-rainbowkit).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about this stack, take a look at the following resources:

- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.

You can check out [the RainbowKit GitHub repository](https://github.com/rainbow-me/rainbowkit) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
# Capybara
