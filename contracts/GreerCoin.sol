pragma solidity >=0.4.22 <0.9.0;

contract GreerCoin {
    
    string public name;
    string public symbol;
    string public standard;

    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner, 
        address indexed _spender, 
        uint256 _value
    );

    constructor(uint _initialSupply, string memory _name, string memory _symbol, uint8 _decimals, string memory _standard) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        name = _name;
        symbol = _symbol;
        standard = _standard;
        decimals = _decimals;
    }
    
    function transfer(address _to, uint256 _value) public returns(bool success) {
        require(balanceOf[msg.sender] >= _value, "msg.sender does not have enough GreerCoins to perform this transaction");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // Send _value from _from to _to, but use msg.sender's balance
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) { 
        require(_value <= balanceOf[_from], "Not enough GreerCoins available in _from account");
        require(_value <= allowance[_from][msg.sender], "_from is not approved to send that amount to _to");
        
        // Perform balance transfer
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // Update the allowance after balance transfer is done
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // Allow _spender to send up to _value using msg.sender's acct
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}