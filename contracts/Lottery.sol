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
        // The amount the user currently has deposited
        uint256 deposit;
        // The amount the user has deposited that is active in the current lottery
        uint256 depositActive;
        // The total amount the user has ever won
        uint256 totalPrizesWon;
        // Whether this account has ever entered the lottery
        bool active;
    }

    // Maps address -> entrant structs
    mapping(address => Entrant) private _entrants;

    // List of all addresses that have ever entered the lottery
    address[] private _addrs;

    // Total balance deposited
    uint256 private _pool;

    // Total balance active
    uint256 private _poolActive;

    // Unix timestamp of last lottery
    uint256 private _lastLottery = 0;

    // Minimum number of seconds between lotteries
    uint256 public constant lotteryInterval = 86400;

    /**
     * @dev Deposit DAI into the contract, thus entering the lottery.
     * @param aaveAddr Address of Aave contract.
     * @param daiAddr Address of DAI contract.
     * @param amt Amount of DAI to deposit in units where 10^6 units = 1 DAI.
     */
    function deposit(
        address aaveAddr,
        address daiAddr,
        uint256 amt
    ) public {
        require(amt > 0);

        IERC20 dai = IERC20(daiAddr);

        // Transfer user's DAI into our contract
        dai.transferFrom(msg.sender, address(this), amt);

        // Approve DAI to be sent to Aave
        dai.approve(aaveAddr, amt);

        // Supply DAI to Aave
        AaveInterface(aaveAddr).supply(daiAddr, amt, address(this), 0);

        // Add address to list and mark it as seen
        if (!_entrants[msg.sender].active) {
            _addrs.push(msg.sender);
            _entrants[msg.sender].active = true;
        }

        // Record user deposit but mark it as inactive
        // Deposits only become active starting with the next lottery
        _pool += amt;
        _entrants[msg.sender].deposit += amt;
    }

    /**
     * @dev Withdraw all DAI from the contract, thus exiting the lottery.
     * @param aaveAddr Address of Aave contract.
     * @param daiAddr Address of DAI contract.
     */
    function withdraw(address aaveAddr, address daiAddr) public {
        require(_entrants[msg.sender].deposit > 0);

        uint256 userDeposit = _entrants[msg.sender].deposit;

        // Withdraw user's funds from Aave
        AaveInterface(aaveAddr).withdraw(daiAddr, userDeposit, address(this));

        _pool -= userDeposit;
        _poolActive -= _entrants[msg.sender].depositActive;

        _entrants[msg.sender].deposit = 0;
        _entrants[msg.sender].depositActive = 0;

        // Transfer withdrawn funds to user
        IERC20(daiAddr).transfer(msg.sender, userDeposit);
    }

    /**
     * @dev Run the lottery.
     * @param aaveAddr Address of Aave contract.
     * @param daiAddr Address of DAI contract.
     */
    function runLottery(address aaveAddr, address daiAddr) public {
        // Enforce minimum interval between lotteries
        require(block.timestamp - _lastLottery >= lotteryInterval);

        // Edge case: first lottery
        if (_lastLottery == 0) {
            _lastLottery = block.timestamp;
            return;
        }

        // Determine winner
        address winner = _determineWinner();

        // Determine amount of interest accrued since last lottery
        uint256 accrued = getAccruedInterest(aaveAddr);

        // Withdraw the accrued interest from Aave
        AaveInterface(aaveAddr).withdraw(daiAddr, accrued, address(this));

        // Send ~ 99% of the accrued interest to the winner as the prize
        uint256 prize = (accrued * 99) / 100;
        IERC20(daiAddr).transfer(winner, prize);
        _entrants[winner].totalPrizesWon += prize;

        // Send ~ 1% of the accrued interest to the caller as an incentive for running the lottery
        IERC20(daiAddr).transfer(msg.sender, accrued - prize);

        // Add all inactive deposits into lottery
        _includeAllInLottery();

        // Update last lottery timestamp
        _lastLottery = block.timestamp;
    }

    /**
     * @dev Returns the current amount of interest accrued.
     * @param aaveAddr Address of Aave contract.
     */
    function getAccruedInterest(address aaveAddr)
        public
        view
        returns (uint256)
    {
        // Edge case: no one has ever deposited
        if (_addrs.length == 0) {
            return 0;
        }
        // Get the total balance currently in Aave (includes interest accrued)
        (uint256 totalCollateralBase, , , , , ) = AaveInterface(aaveAddr)
            .getUserAccountData(address(this));

        // Aave reports the collateral in 10^8 units so we expand it to 10^18
        totalCollateralBase *= 10**10;

        // Interest accrued is the additional amount above our total deposit
        return totalCollateralBase - _pool;
    }

    /**
     * @dev Include all deposits into the lottery.
     */
    function _includeAllInLottery() public {
        for (uint256 i = 0; i < _addrs.length; i++) {
            _entrants[_addrs[i]].depositActive = _entrants[_addrs[i]].deposit;
        }
        _poolActive = _pool;
    }

    /**
     * @dev Randomly select a winner, where each address's chance of winning
     *      is proportional to their share of the pool.
     */
    function _determineWinner() private view returns (address) {
        // Edge case: possible that all users withdrew all funds before the lottery
        // This effectively carries forward the prize to the next lottery
        if (_poolActive == 0) {
            return address(this);
        }

        // Generate a random value in the range [0, _poolActive)
        uint256 randValue = _random(_poolActive);

        // Track cumulative sum of active deposits
        uint256 cumulative = 0;

        for (uint256 i = 0; i < _addrs.length; i++) {
            cumulative += _entrants[_addrs[i]].depositActive;
            if (cumulative > randValue) {
                return _addrs[i];
            }
        }

        // Should never reach here.
        revert("no winner");
    }

    /**
     * @dev Returns a random uint256 in the range [0, upperBound).
     * @param upperBound Upper bound of the range.
     * NOTE: This way of generating random numbers is can technically be exploited,
     *       but is good enough for now in lieu of a Chainlink VRF orcale on Arbitrum.
     */
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

    /**
     * @dev Returns the user's current deposit.
     */
    function getUserDeposit() public view returns (uint256) {
        return _entrants[msg.sender].deposit;
    }

    /**
     * @dev Returns the user's current active deposit.
     */
    function getUserActiveDeposit() public view returns (uint256) {
        return _entrants[msg.sender].depositActive;
    }

    /**
     * @dev Returns the user's total prizes won.
     */
    function getUserTotalPrizesWon() public view returns (uint256) {
        return _entrants[msg.sender].totalPrizesWon;
    }

    /**
     * @dev Returns the current size of the pool.
     */
    function getPool() public view returns (uint256) {
        return _pool;
    }

    /**
     * @dev Returns the current size of the active pool.
     */
    function getActivePool() public view returns (uint256) {
        return _poolActive;
    }

    /**
     * @dev Returns the unix timestamp of the last lottery.
     */
    function getLastLotteryTimestamp() public view returns (uint256) {
        return _lastLottery;
    }
}
