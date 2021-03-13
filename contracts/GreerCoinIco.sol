pragma solidity >=0.4.22 <0.9.0;

import "./GreerCoin.sol";

contract GreerCoinIco {

    GreerCoin public tokenContract;

    address payable admin;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address indexed _buyer,
        uint256 _units  
    );

    event Log(
        uint256 total,
        uint256 tokenPrice,
        uint256 numberOfTokens,
        uint256 msgValue
    );

    constructor(GreerCoin _tokenContract, uint256 _tokenPrice) public {
        // Assign an admin
        admin = msg.sender;

        // Assign token contract
        tokenContract = _tokenContract;
        
        // Set token price
        tokenPrice = _tokenPrice;
    }

    // https://github.com/dapphub/ds-math/blob/master/src/math.sol
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    // Buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable {

        // Require that value is equal to the worth of token purchase
        require(multiply(_numberOfTokens, tokenPrice) == msg.value, "The ether sent by client matches the value of the tokens requested");

        // Require that contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "The number of tokens requested should not exceed units available to contract");

        // Require that same was successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "Tokens should be transferred successfully");

        // Keep track of tokens sold
        tokensSold += _numberOfTokens;

        // Trigger Sell event
        emit Sell(msg.sender, _numberOfTokens); 
    }

    function endSale() public {
        // Only allow admin to send sale
        require(msg.sender == admin, "only admin can end sale");

        // Transfer remaining dapp tokens back to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))), "must transfer remaining balance back to admin");

        // Destroy contract
        selfdestruct(admin);
    }
}