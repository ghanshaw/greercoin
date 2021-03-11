const GreerCoin = artifacts.require("GreerCoin");
const GreerCoinIso = artifacts.require("GreerCoinIso");
const settings = require('../constants/settings');

module.exports = function (deployer) {

  const tokenPrice = settings.test.token_price;
  const initialSupply = settings.test.initial_supply;
  const icoSupply = settings.test.ico_supply;
  const name = settings.name;
  const symbol = settings.symbol;
  let greerCoinInstance;
  let greerCoinIsoInstance;

  deployer.deploy(GreerCoin, initialSupply, name, symbol, "GreerCoin v1.0")
    .then((instance) => {
      greerCoinInstance = instance;

      return deployer.deploy(GreerCoinIso, GreerCoin.address, tokenPrice)
    })
    .then((instance) => {
      greerCoinIsoInstance = instance;

      return greerCoinInstance.transfer(greerCoinIsoInstance.address, icoSupply);
    })
    .catch(err => {
      console.log(err);
    })
    
};
