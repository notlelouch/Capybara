// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract FakeNFTMarketplace {
    
    // Mapping of fake TokenId to owner addresses
    mapping(uint256 => address) public tokens;

    // price of each nft wil b same i.e. 0.01 ether
    uint256 nftprice = 0.01 ether;

    function purchase(uint256 _tokenId) external payable {
        require(msg.value == nftprice, "This NFT costs 0.1 ether");
        tokens[_tokenId] = msg.sender;
    }

    function getPrice() external view returns (uint256) {
        return nftprice;
    }

    function available(uint256 _tokenId) external view returns (bool) {
        if (tokens[_tokenId] == address(0)) {
            return true;
        }
        return false;
    }

}