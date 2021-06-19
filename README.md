# Freigeld ERC20

A form of [Freigeld](https://en.wikipedia.org/wiki/Freigeld) (Free Money) poposed by [Silvio Gesell](https://en.wikipedia.org/wiki/Silvio_Gesell) implemented as an ERC20 token.

## Added Functions

It mostly inherits from OpenZeppelin's [ERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol) token, but with a few modifications.

### _setRate

Sets the interest rate per block with a combination of `numerator` and `denominator`.

``` js
function _setRate (uint256 _numerator, uint256 _denominator) internal virtual
```

### totalInterests

Returns the amount of interests deducted from the totalSupply.

``` js
function totalInterests() public view virtual returns (uint256)
```

## Test

``` bash
yarn test
```
