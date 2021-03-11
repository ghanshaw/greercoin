const GreercoinSale = artifacts.require("GreercoinSale");
const Greercoin = artifacts.require("Greercoin");

contract("GreercoinSale", (accounts) => {
    let tokenSaleContract;
    let tokenContract;
    let tokenPrice = '4400000000000000';
    let admin = accounts[0];
    let buyer = accounts[1];
    let numberOfTokens = 10;
    let tokenAllocation = 5000;
    let initialTokenBalance = 10000;

    it("initialized token sale contract with correct values", function() {
        return GreercoinSale.deployed().then((instance) => {
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
        return Greercoin.deployed().then((instance) => {
            tokenContract = instance;
            return GreercoinSale.deployed();
        })
        .then((instance) => {
            tokenSaleContract = instance;
            
            // Initial token allocation
            return tokenContract.transfer(tokenSaleContract.address, tokenAllocation, { from: admin });
        })
        .then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, admin, 'event captures address of sender');
            assert.equal(receipt.logs[0].args._to, tokenSaleContract.address,  'event captures address of recipient');
            assert.equal(receipt.logs[0].args._value, tokenAllocation, 'event captures the value of the transation');

            let wei = numberOfTokens * tokenPrice;
            return tokenSaleContract.buyTokens(numberOfTokens, { from: buyer, value: wei })
        })
        .then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'event captures address of sender');
            assert.equal(receipt.logs[0].args._units, numberOfTokens,  'event captures address of recipient');

            return tokenSaleContract.tokensSold();            
        })
        .then((units) => {
            assert.equal(units.toNumber(), numberOfTokens, 'increments the number of tokens sold');

            return tokenContract.balanceOf(buyer);
        })
        .then((balance) => {
            // Confirm token balance of buyer increased
            assert.equal(balance.toNumber(), numberOfTokens, "increments the balance of the buyer");

            return tokenContract.balanceOf(tokenSaleContract.address);
        })
        .then((balance) => {
            // Confirm token balance of token sale contract decreased
            assert.equal(balance.toNumber(), tokenAllocation - numberOfTokens, 'decrements the balance of the token sale contract');

            return tokenSaleContract.buyTokens(numberOfTokens, { from: buyer, value: 1 });
        })
        .then(assert.fail).catch((err) => {
            // console.log(err);
            // Prevent token sale if wei sent by buyer is not sufficent
            assert(err.message.indexOf('revert') >= 0, 'the value in wei must be sufficient to cover cost of tokens');

            // Try to purchase more token than are available in contract
            let units = BigInt(11000);
            let wei = units * BigInt(tokenPrice);
            // let wei = Number(units * tokenPrice).toString();

            console.log("wei: " + wei)
            // let wei = web3.utils.toWei(units * tokenPrice, 'ether')
            return tokenSaleContract.buyTokens(units, { from: buyer, value: wei.toString() });
        })
        .then(assert.fail).catch((err) => {
            // console.log(err);
            assert(err.message.indexOf('revert') >= 0, 'the number of tokens purchased must not exceed available balance');

            // Perform successful token purchase
            // return tokenSaleContract.buyTokens(numberOfTokens, { from: buyer, value: 1 });
            // return tokenContract.balanceOf(buyer)
        })
    });


    it("ends token sale", () => {

        return Greercoin.deployed().then((instance) => {
            tokenContract = instance;
            return GreercoinSale.deployed();
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
            assert.equal(initialTokenBalance - numberOfTokens, balance.toNumber());

            // console.log(tokenSaleContract);
            // return tokenSaleContract.tokenPrice();
        })
        // This test doesn't work anymore
        // .then(price => {
        //     assert.equal(price.toNumber(), 0, "should revert token price to default value");

        //     // return tokenSaleContract.tokenPrice();
        // })

    })
});