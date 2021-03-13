const GreerCoinIco = artifacts.require("GreerCoinIco");
const GreerCoin = artifacts.require("GreerCoin");
const settings = require('../constants/settings');

contract("GreerCoinIco", (accounts) => {
    let tokenSaleContract;
    let tokenContract;

    const tokenPurchase = 10;
    const admin = accounts[0];
    const buyer = accounts[1];
    const args = settings.test;
    const tokenPrice = args.token_price;
    const initialSupply = args.initial_supply;
    const icoSupply = args.ico_supply;

    it("initialized token sale contract with correct values", function() {
        return GreerCoinIco.deployed().then((instance) => {
            tokenSaleContract = instance;
            return tokenSaleContract.address;
        })
        .then((address) => {
            assert.notEqual(address, 0x0, 'address of token sale contract is not blank');
            return tokenSaleContract.tokenContract();
        })
        .then((address) => {
            assert.notEqual(address, 0x0, 'address is token contract is not blank');
            return tokenSaleContract.tokenPrice();
        })
        .then((price) => {
            assert.equal(price.toString(), tokenPrice, 'value of token price is accurate');
            return tokenSaleContract.tokenPrice();
        })
    })

    it("facilitates token buying", function() {
        return GreerCoin.deployed().then((instance) => {
            tokenContract = instance;
            return GreerCoinIco.deployed();
        })
        .then((instance) => {
            tokenSaleContract = instance;
            
            // Initial token allocation
            return tokenContract.transfer(tokenSaleContract.address, icoSupply, { from: admin });
        })
        .then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, admin, 'event captures address of sender');
            assert.equal(receipt.logs[0].args._to, tokenSaleContract.address,  'event captures address of recipient');
            assert.equal(receipt.logs[0].args._value, icoSupply, 'event captures the value of the transation');

            let wei = tokenPurchase * tokenPrice;

            // Perform successful token purchase
            return tokenSaleContract.buyTokens(tokenPurchase, { from: buyer, value: wei })
        })
        .then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'event captures address of sender');
            assert.equal(receipt.logs[0].args._units, tokenPurchase,  'event captures address of recipient');

            return tokenSaleContract.tokensSold();            
        })
        .then((units) => {
            assert.equal(units.toNumber(), tokenPurchase, 'increments the number of tokens sold');

            return tokenContract.balanceOf(buyer);
        })
        .then((balance) => {
            // Confirm token balance of buyer increased
            assert.equal(balance.toNumber(), tokenPurchase, "increments the balance of the buyer");

            return tokenContract.balanceOf(tokenSaleContract.address);
        })
        .then((balance) => {
            // Confirm token balance of token sale contract decreased
            assert.equal(balance.toNumber(), icoSupply - tokenPurchase, 'decrements the balance of the token sale contract');

            // Attempt to buy x tokens with 1 wei
            return tokenSaleContract.buyTokens(tokenPurchase, { from: buyer, value: 1 });
        })
        .then(assert.fail).catch((err) => {
            // Prevent token sale if wei sent by buyer is not sufficent
            assert(err.message.indexOf('revert') >= 0, 'the client must send sufficent wei to cover token sale');

            // Try to purchase more tokens than are available in contract
            let units = BigInt(999999);
            let wei = units * BigInt(tokenPrice);

            return tokenSaleContract.buyTokens(units, { from: buyer, value: wei.toString() });
        })
        .then(assert.fail).catch((err) => {
            // Prevent token sale if buyer attempt to purchase too many tokens
            assert(err.message.indexOf('revert') >= 0, 'the number of tokens purchased must not exceed available balance');
        })
    });


    it("ends token sale", () => {

        return GreerCoin.deployed().then((instance) => {
            tokenContract = instance;
            return GreerCoinIco.deployed();
        })
        .then((instance) => {
            tokenSaleContract = instance;
            
            // End sale as buyer
            return tokenSaleContract.endSale({ from: buyer });
        })
        .then(assert.fail).catch((err) => {
            assert(err.message.indexOf('revert') >= 0, 'only admin can end sale');

            // End sale as admin
            return tokenSaleContract.endSale({ from: admin });
        })
        .then(receipt => {
            return tokenContract.balanceOf(admin);
        })
        .then(balance => {
            // Confirm that balance of contract was sent to admin
            assert.equal(initialSupply - tokenPurchase, balance.toNumber());
        })
    })
});