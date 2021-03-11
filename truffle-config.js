const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = require('./constants/mnemonic');

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
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic.ropsten, "https://ropsten.infura.io/v3/1ef7e6ae9b5f4abda10188b9f4a6cc84")
      },
      network_id: 3
    }
  }
};
