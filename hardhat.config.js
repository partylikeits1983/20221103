/** @type import('hardhat/config').HardhatUserConfig */
require("hardhat-deploy");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

require('dotenv').config();

module.exports = {
  networks: {
    hardhat: {
      forking: {
        // url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        // url: `https://bsc-dataseed.binance.org/`,
        url: `https://api.avax.network/ext/bc/C/rpc`,
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {},
      }],
  },
};
