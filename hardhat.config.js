require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.13",
  networks: {
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    arbitrum_testnet: {
      url: "https://rinkeby.arbitrum.io/rpc",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    hardhat: {
      chainId: 1337,
    },
  },
};
