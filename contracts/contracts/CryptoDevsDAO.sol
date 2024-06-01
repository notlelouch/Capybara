// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

// Interface for the FakeNFTMarketplace
interface IFakeNFTMarketplace {
    
    function getPrice() external view returns (uint256);

    function available(uint256 _tokenId) external view returns (bool);

    function purchase(uint256 _tokenId) external payable;
}

// Minimal interface for CryptoDevsNFT containing only two functions that we are interested in
interface ICryptoDevsNFT {
    //balanceOf returns the number of NFTs owned by the given address
    function balanceOf(address owner) external view returns (uint256);

    // Returns a tokenID at given index for owner's list of NFTs
    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256);
}

contract CryptoDevsDAO is Ownable {
    
    struct Proposal {
        uint256 nftTokenID;
        uint256 deadline;
        uint256 yayVotes;
        uint256 nayVotes;
        // Whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
        bool executed;
        // A mapping of CryptoDevsNFT tokenIDs to booleans indicating whether that NFT has already been used to cast a vote or not.
        mapping (uint256 => bool) voters;
    }

    mapping (uint256 => Proposal) public proposals;
    uint256 public numProposals;

    IFakeNFTMarketplace nftMarketplace;
    ICryptoDevsNFT cryptoDevsNFT;

    constructor(address _nftMarketplace, address _cryptoDevsNFT, address initialOwner) payable Ownable(initialOwner) {
        nftMarketplace = IFakeNFTMarketplace(_nftMarketplace);
        cryptoDevsNFT = ICryptoDevsNFT(_cryptoDevsNFT);
    }

    modifier nftHolderOnly() {
        require(cryptoDevsNFT.balanceOf(msg.sender) > 0, "Not_A_DAO_MEMBER");
        _;
    }

    // creates proposal for _nftTokenId token and returns the proposal index for the proposal created
    function createProposal(uint256 _nftTokenId) 
        external 
        nftHolderOnly 
        returns (uint256) 
    {
        require(nftMarketplace.available(_nftTokenId),"NFT_NOT_FOR_SALE");

        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenID = _nftTokenId;
        proposal.deadline = block.timestamp + 5 minutes;
        numProposals++;
        
        return numProposals - 1;
    }

    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp, 
            "VOTING_DEADLINE_EXCEEDED" 
        );
        _;
    }

    enum Vote {
        YAY,
        NAY
    }

    function voteOnProposal(uint256 proposalIndex, Vote vote) 
        external 
        nftHolderOnly 
        activeProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];

        uint256 voterNFTBalance = cryptoDevsNFT.balanceOf(msg.sender);
        uint256 numVotes = 0;

        for (uint256 i = 0; i < voterNFTBalance; i++) {
            uint256 tokenId = cryptoDevsNFT.tokenOfOwnerByIndex(msg.sender, i);
            if (proposal.voters[tokenId] = false) {
                numVotes++;
                proposal.voters[tokenId] = true;
            }
        }

        if (vote == Vote.YAY) {
            proposal.yayVotes += numVotes;
        } else {
            proposal.nayVotes += numVotes;
        }
    }

    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(proposals[proposalIndex].deadline <= block.timestamp,
         "DEADLINE_NOT_EXCEEDED"
        );
        require(proposals[proposalIndex].executed == false,
         "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    function executeProposal(uint256 proposalIndex)
        external
        nftHolderOnly
        inactiveProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];

        if (proposal.yayVotes > proposal.nayVotes) {
            uint256 nftPrice = nftMarketplace.getPrice();
            require(address(this).balance >= nftPrice, "NOT_SUFFICIENT_BALANCE");
            nftMarketplace.purchase{value : nftPrice}(proposal.nftTokenID);
        }
        proposal.executed = true;
    }

    function withdrawEther() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw, contract balance zero");
        (bool sent, ) = payable(owner()).call{value : amount}("");
        require(sent, "FAILED_TO_WITHDRAW_ETHER");
    }    

    // Accept ETH deposits directly from a wallet without calling a function
    receive() external payable {}
    fallback() external payable {}


}