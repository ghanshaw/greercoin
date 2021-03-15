const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

require('dotenv').config()
const constants = require('./constants');

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(process.env.MNENOMIC_MAINNET, constants.infura.endpoint.mainnet + process.env.INFURA_API_KEY)
      },
      network_id: 1,
      gasPrice: 80000000000
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(process.env.MNENOMIC_ROPSTEN, constants.infura.endpoint.ropsten + process.env.INFURA_API_KEY)
      },
      network_id: 3
    }
  }
};
