const func = async function (hre) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();
  
    await deploy("Swap", {
      from: deployer,
      log: true,
      libraries: {
        SwapUtils: (await get("SwapUtils")).address,
        AmplificationUtils: (await get("AmplificationUtils")).address,
      },
      skipIfAlreadyDeployed: true,
    });
  
  // @dev the initialize function
  /* 
  function initialize(
      address _gAvax,
      uint256 _pooledTokenId,
      string memory lpTokenName,
      string memory lpTokenSymbol,
      uint256 _a,
      uint256 _fee,
      uint256 _adminFee,
      address lpTokenTargetAddress
    ) public virtual override initializer returns (address) {
  */
    // @dev call initialize after deploy
    // better yet, call it in the swap contract constructor
    await swap.initialize(await get("gAVAX").address, 0, "token", "LPtoken", "1000", "1000", "1000", await get("LPToken").address);
  };
  module.exports = func;
  module.exports.tags = ["Swap"];
  module.exports.dependencies = ["AmplificationUtils", "SwapUtils"];
  