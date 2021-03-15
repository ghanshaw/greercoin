const GreerCoin = artifacts.require("GreerCoin");
const constants = require('../constants');

contract("GreerCoin", (accounts) => {    
    let _transferValue = 2500;
    let _allowance = 100;

    let tokenInstance;
    const name = constants.name;
    const symbol = constants.symbol;
    const standard = constants.standard;
    const decimals = constants.decimals;    
    const initialSupply = constants.test.initial_supply;

    it("intializes contract with the correct values", function() {
        return GreerCoin.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.name();
        })
        .then((_name) => {
            assert.equal(name, _name, 'has the correct name')
            return tokenInstance.symbol();
        })
        .then((_symbol) => {
            assert.equal(symbol, _symbol, 'has the correct symbol')
            return tokenInstance.standard();
        })
        .then((_standard) => {
            assert.equal(standard, _standard, 'has the correct standard')
            return tokenInstance.decimals();
        })
        .then((_decimals) => {
            assert.equal(decimals, _decimals, 'has the correct decimals')
        })
    })


    it("allocates initial supply on deployment", function() {
        return GreerCoin.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        })
        .then((totalSupply) => {
            assert.equal(totalSupply.toNumber(), initialSupply, `sets the total supply to ${initialSupply}`)
            return tokenInstance.balanceOf(accounts[0]);
        })
        .then((adminBalance) => {
            assert.equal(adminBalance.toNumber(), initialSupply, "admin has initial supply less ico supply after migration")
        })
    })
    

    it('transfers token ownership', function() {
        return GreerCoin.deployed().then((instance) => {
            tokenInstance = instance;

            // Transfer large amount to a test account
            return tokenInstance.transfer.call(accounts[1], 999999999)
        })
        .then(assert.fail)
        .catch((err) => {
            assert(err.message.indexOf('revert') >= 0, 'error message must contain "revert"');
            return tokenInstance.transfer.call(accounts[1], _transferValue, { 
                from: accounts[0]
            })
        })
        .then((_success) => {
            assert(_success, true, 'should return "true" boolean')
            return tokenInstance.transfer(accounts[1], _transferValue, { 
                from: accounts[0]
            })
        })
        .then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'event captures address of sender');
            assert.equal(receipt.logs[0].args._to, accounts[1],  'event captures address of recipient');
            assert.equal(receipt.logs[0].args._value, _transferValue, 'event captures the value of the transation');
            return tokenInstance.balanceOf(accounts[1])
        })
        .then((balance) => {
            assert.equal(balance.toNumber(), _transferValue, "adds to amount to recipient's account");
            return tokenInstance.balanceOf(accounts[0])
        })
        .then((balance) => {
            assert.equal(balance.toNumber(), initialSupply - _transferValue, "deducts amount from admina account");
            return tokenInstance.balanceOf(accounts[0])
        })
    })

    it("approves tokens for delegated transfer", function() {
        return GreerCoin.deployed().then((instance) => {
            let tokenInstance = instance;

            return tokenInstance.approve.call(accounts[1], _allowance);
        })
        .then((_success) => {
            assert.equal(true, _success, 'should return value of "true"');
            return tokenInstance.approve(accounts[1], _allowance);
        })
        .then(receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'event captures address of owner');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'event captures address of spender');
            assert.equal(receipt.logs[0].args._value, _allowance, 'event captures the value of the transation');
            return tokenInstance.allowance(accounts[0], accounts[1])
        })
        .then((allowance) => {
            assert.equal(_allowance, allowance, "stores the allowance for delegated transfer");
        })
    })

    let fromAccount;
    let toAccount;
    let spendingAccount;
    let adminAccount;

    it("handles tokens for delegated transfer", function() {
        return GreerCoin.deployed().then((instance) => {
            let tokenInstance = instance;
            adminAccount = accounts[0]
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];

            // Transfer tokens to 'fromAccount'
            return tokenInstance.transfer(fromAccount, _transferValue, { from: adminAccount });
        }) 
        .then((_receipt) => {
            // Will allow fromAccount to spend up to <value> from <spendingAccount>'s balance
            return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
        })
        .then(_receipt => {
            // Try transfering amount larger than available balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
        })
        .then(assert.fail)
        .catch(err => {
            assert(err.message.indexOf('revert') >= 0, "should fail when transfering value larger than available balance");

            // Try transfering amount larger than available approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
        })
        .then(assert.fail)
        .catch(err => {
            assert(err.message.indexOf('revert') >= 0, "should fail when transfering value larger than approved amount");

            return tokenInstance.transferFrom.call(fromAccount, toAccount, 5, { from: spendingAccount });
        })
        .then((_success) => {
            assert.equal(true, _success, 'should return value of "true"');

            return tokenInstance.transferFrom(fromAccount, toAccount, 5, { from: spendingAccount });
        })
        .then(receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'event captures address of sender');
            assert.equal(receipt.logs[0].args._to, toAccount,  'event captures address of recipient');
            assert.equal(receipt.logs[0].args._value, 5, 'event captures the value of the transation');
            return tokenInstance.balanceOf(toAccount)
        })
        .then((balance) => {
            assert.equal(balance.toNumber(), 5, "adds to amount to recipient's account");
            return tokenInstance.balanceOf(fromAccount);
        })
        .then((balance) => {
            assert.equal(balance.toNumber(), _transferValue - 5, "deducts amount from originating account");
            return tokenInstance.allowance(fromAccount, spendingAccount);
        })
        .then(allowance => {
            assert.equal(allowance.toNumber(), 5, "deducts amount from the allowance");
        })
    })
})