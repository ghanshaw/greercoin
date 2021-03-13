const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = require('./constants/mnemonic');
const settings = require('./constants/settings');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(mnemonic.mainnet, settings.infura.endpoint.mainnet)
      },
      network_id: 1
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic.ropsten, settings.infura.endpoint.ropsten)
      },
      network_id: 3
    }
  }
};
