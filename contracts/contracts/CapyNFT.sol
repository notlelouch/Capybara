// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CapyNFT is ERC721Enumerable {

    constructor() ERC721("Capy", "CP") {}

    function mint() public {
        _safeMint(msg.sender, totalSupply());
    }

}