//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../ERC20Freigeld.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20Freigeld, Ownable {
  string public url;
  constructor(string memory _name, string memory _sym) ERC20Freigeld(_name, _sym) {}
  
  function mint (address _to, uint _amount) external onlyOwner {
    _mint(_to, _amount);
  }
  
  function setRate (uint256 _num, uint256 _denom) external onlyOwner {
    _setRate(_num, _denom);
  }

  function burn(uint256 amount) public virtual {
    _burn(_msgSender(), amount);
  }

  function burnFrom(address account, uint256 amount) public virtual {
    uint256 currentAllowance = allowance(account, _msgSender());
    require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
    _approve(account, _msgSender(), currentAllowance - amount);
    _burn(account, amount);
  }

  function addBlock() public {}
  
}
