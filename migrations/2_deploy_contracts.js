const GreerCoin = artifacts.require("GreerCoin");
const GreerCoinSale = artifacts.require("GreerCoinSale");
const constants = require('../constants');

module.exports = function(deployer, network) {

  let greerCoinInstance;
  let greerCoinSaleInstance;

  const name = constants.name;
  const symbol = constants.symbol;
  const decimals = constants.decimals;
  const standard = constants.standard;
  
  let args = constants.test;
  if (network === 'mainnet') {
    args = constants.prod;
  } 

  const tokenPrice = args.token_price;
  const initialSupply = args.initial_supply;
  const icoSupply = args.ico_supply;

  // Deploy GreerCoin
  deployer.deploy(GreerCoin, initialSupply, name, symbol, decimals, standard)
    .then((instance) => {
      greerCoinInstance = instance;

      // Deploy GreerCoinSale
      return deployer.deploy(GreerCoinSale, GreerCoin.address, tokenPrice)
    })
    .then((instance) => {
      greerCoinSaleInstance = instance;

      // Don't allocate coins during test
      if (network === 'test')  return true;

      // Transfer balance to GreerCoinSale
      return greerCoinInstance.transfer(greerCoinSaleInstance.address, icoSupply);
    })
    .catch(err => {
      console.log(err);
    })
    
};
