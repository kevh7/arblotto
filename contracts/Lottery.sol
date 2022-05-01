// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface AaveInterface {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);

    function getUserAccountData(address user)
        external
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        );
}

interface IERC20 {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract Lottery {
    struct Entrant {
        uint256 deposit;
        uint256 totalPrizesWon;
        bool active;
    }

    // List of all addrs
    address[] private _addrs;

    // Maps address -> entrant structs
    mapping(address => Entrant) private _entrants;

    // Total balance deposited
    uint256 _pool;

    // Total balance active
    uint256 _active_pool;

    // Unix timestamp of last lottery
    uint256 _lastLottery = 0;

    // amt should be in 10^6 units (eg. 10^6 = 1 USDC)
    function deposit(
        address aaveAddr,
        address erc20Addr,
        uint256 amt
    ) public {
        require(amt > 0);
        require(!_entrants[msg.sender].active);

        IERC20 token = IERC20(erc20Addr);

        // transfer user's funds into our contract
        token.transferFrom(msg.sender, address(this), amt);

        // approve funds to be sent to Aave
        token.approve(aaveAddr, amt);

        // supply funds to Aave
        AaveInterface(aaveAddr).supply(erc20Addr, amt, address(this), 0);

        // record user deposit but mark as inactive
        _pool += amt;
        _addrs.push(msg.sender);
        _entrants[msg.sender].deposit += amt;
    }

    function withdraw(address aaveAddr, address erc20Addr) public {
        require(_entrants[msg.sender].deposit > 0);

        uint256 amt = _entrants[msg.sender].deposit;
        if (_entrants[msg.sender].active) {
            _active_pool -= amt;
        }
        _pool -= amt;

        // remove user from lottery
        delete _entrants[msg.sender];

        // withdraw users funds (amt) from Aave
        AaveInterface(aaveAddr).withdraw(erc20Addr, amt, address(this));

        // transfer funds to user
        IERC20(erc20Addr).transfer(msg.sender, amt);
    }

    function getDeposited() public view returns (uint256) {
        return _entrants[msg.sender].deposit;
    }

    function getTotalPrizesWon() public view returns (uint256) {
        return _entrants[msg.sender].totalPrizesWon;
    }

    function getCurrentPoolSize() public view returns (uint256) {
        return _pool;
    }

    function getEstimatedNextPrize(address aaveAddr)
        public
        view
        returns (uint256)
    {
        return
            (getAccruedInterest(aaveAddr) * 86400) /
            (block.timestamp - _lastLottery);
    }

    function getAccruedInterest(address aaveAddr)
        public
        view
        returns (uint256)
    {
        // get total balance currently in Aave (includes interest accrued)
        (uint256 totalCollateralBase, , , , , ) = AaveInterface(aaveAddr)
            .getUserAccountData(address(this));

        // Aave reports the collateral in 10^8 units so we reduce it to 10^6
        totalCollateralBase /= 100;
        return totalCollateralBase - _pool;
    }

    function getLastLotteryTimestamp() public view returns (uint256) {
        return _lastLottery;
    }

    function runLottery(address aaveAddr, address erc20Addr) public {
        // enforce at least 24 hours between lotteries
        require(block.timestamp - _lastLottery > 86400);

        // determine winner
        address winner = _determineWinner();

        // determine amount of interest accrued since last lottery
        uint256 accrued = getAccruedInterest(aaveAddr);

        // withdraw accrued interest from Aave
        AaveInterface(aaveAddr).withdraw(erc20Addr, accrued, address(this));

        // send accrued interest to winner
        IERC20(erc20Addr).transfer(winner, (accrued * 99) / 100);
        _entrants[winner].totalPrizesWon += (accrued * 99) / 100;

        // send 1% of interest to the caller as an incentive for running the lottery
        IERC20(erc20Addr).transfer(msg.sender, (accrued * 1) / 100);

        // add all inactive users into lottery
        _includeInLottery();

        _lastLottery = block.timestamp;
    }

    function _includeInLottery() public {
        for (uint256 i = 0; i < _addrs.length; i++) {
            if (
                _entrants[_addrs[i]].active || _entrants[_addrs[i]].deposit == 0
            ) {
                continue;
            }
            _entrants[_addrs[i]].active = true;
            _active_pool += _entrants[_addrs[i]].deposit;
        }
    }

    // weighted random selection
    function _determineWinner() private view returns (address) {
        uint256 cumulative = 0;
        for (uint256 i = 0; i < _addrs.length; i++) {
            if (!_entrants[_addrs[i]].active) {
                continue;
            }
            cumulative += _entrants[_addrs[i]].deposit;
            if (cumulative >= _random(_active_pool)) {
                return _addrs[i];
            }
        }
        return _addrs[_addrs.length - 1];
    }

    // returns a random number in the range [0, upperBound)
    // NOTE: this way of generating random numbers is insecure but good enough for now
    function _random(uint256 upperBound) private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        msg.sender
                    )
                )
            ) % upperBound;
    }
}
