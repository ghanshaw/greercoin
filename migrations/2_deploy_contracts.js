const GreerCoin = artifacts.require("GreerCoin");
const GreerCoinIco = artifacts.require("GreerCoinIco");
const settings = require('../constants/settings');

module.exports = function(deployer, network) {

  let greerCoinInstance;
  let greerCoinIcoInstance;

  const name = settings.name;
  const symbol = settings.symbol;
  const decimals = settings.decimals;
  const standard = settings.standard;
  
  let args = settings.test;
  if (network === 'mainnet') {
    args = settings.prod;
  } 

  const tokenPrice = args.token_price;
  const initialSupply = args.initial_supply;
  const icoSupply = args.ico_supply;

  // console.log(deployer)  

  // Deploy GreerCoin
  deployer.deploy(GreerCoin, initialSupply, name, symbol, decimals, standard)
    .then((instance) => {
      greerCoinInstance = instance;

      // Deploy GreerCoinIco
      return deployer.deploy(GreerCoinIco, GreerCoin.address, tokenPrice)
    })
    .then((instance) => {
      greerCoinIcoInstance = instance;

      // Don't allocate coins during test
      if (network === 'test')  return true;

      // Transfer balance to GreerCoinIco
      return greerCoinInstance.transfer(greerCoinIcoInstance.address, icoSupply);
    })
    .catch(err => {
      console.log(err);
    })
    
};
