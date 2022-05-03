import React from "react";
import NavBar from "./NavBar";
import MainLottery from "./MainLottery";
import "./Dapp.css";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers, BigNumber } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import LotteryArtifact from "../contracts/Lottery.json";
import IERC20Artifact from "../contracts/IERC20.json";
import contractAddress from "../contracts/contract-address.json";

import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";

import PrizePage from "./PrizePage";
import AboutPage from "./AboutPage";
import TeamPage from "./TeamPage";

const ARBITRUM_MAINNET_NETWORK_ID = "42161";
const ARBITRUM_TESTNET_NETWORK_ID = "421611";
const HARDHAT_NETWORK_ID = "1337";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const AAVE_MAINNET_ADDR = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
const DAI_MAINNET_ADDR = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

const AAVE_TESTNET_ADDR = "0x9C55a3C34de5fd46004Fa44a55490108f7cE388F";
const DAI_TESTNET_ADDR = "0x200c2386A02cbA50563b7b64615B43Ab1874a06e";

// Aave represents all values by the factor of 10^18 units = 1 DAI
const DAI_FACTOR = ethers.utils.parseUnits("1", 18);

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      aaveAddr: undefined,
      daiAddr: undefined,
      page: "home",
      deposited: 1,
      totalPrizesWon: 1,
      estimatedNextPrize: 1,
      lastLotteryTimeStamp: 1,
    };
    this.state = this.initialState;
  }

  homePage = () => {
    this.setState({
      page: "home",
    });
  };
  prizesPage = async () => {
    let deposited = await this.getUserDeposit();
    let totalPrizesWon = await this.getUserTotalPrizesWon();
    let estimatedNextPrize = await this.getEstimatedNextPrize();
    let lastLotteryTimeStamp = await this.getLastLotteryTimestamp();
    this.setState({
      page: "prizes",
      deposited: deposited,
      totalPrizesWon: totalPrizesWon,
      estimatedNextPrize: estimatedNextPrize,
      lastLotteryTimeStamp: lastLotteryTimeStamp,
    });
  };
  aboutPage = () => {
    this.setState({
      page: "about",
    });
  };
  teamPage = () => {
    this.setState({
      page: "team",
    });
  };

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <div className="overlay">
          <div className="Dapp">
            <NavBar
              account={this.state.selectedAddress}
              connectWallet={() => this._connectWallet()}
              homePage={this.homePage}
              prizesPage={this.prizesPage}
              aboutPage={this.aboutPage}
              teamPage={this.teamPage}
            />
            <ConnectWallet
              connectWallet={() => this._connectWallet()}
              networkError={this.state.networkError}
              dismiss={() => this._dismissNetworkError()}
            />
          </div>
          <div className="moving-background"></div>
        </div>
      );
    }

    // If intial state hasn't loaded from the contract yet, we show a loading component.
    // Replace condition with check for whether intial data has been loaded yet
    if (false) {
      return <Loading />;
    }

    if (this.state.page === "prizes") {
      return (
        <div className="overlay">
          <div className="Dapp">
            <NavBar
              account={this.state.selectedAddress}
              connectWallet={() => this._connectWallet()}
              homePage={this.homePage}
              prizesPage={this.prizesPage}
              aboutPage={this.aboutPage}
              teamPage={this.teamPage}
            />
            <PrizePage
              account={this.state.selectedAddress}
              runLottery={this.runLottery}
              withdraw={this.withdraw}
              getDeposited={this.state.deposited}
              getTotalPrizesWon={this.state.totalPrizesWon}
              getEstimatedNextPrize={this.state.estimatedNextPrize}
              getLastLotteryTimestamp={this.state.lastLotteryTimeStamp}
            />
          </div>
          <div className="moving-background"></div>
        </div>
      );
    }
    if (this.state.page === "about") {
      return (
        <div className="overlay">
          <div className="Dapp">
            <NavBar
              account={this.state.selectedAddress}
              connectWallet={() => this._connectWallet()}
              homePage={this.homePage}
              prizesPage={this.prizesPage}
              aboutPage={this.aboutPage}
              teamPage={this.teamPage}
            />
            <AboutPage account={this.state.selectedAddress} />
          </div>
          <div className="moving-background"></div>
        </div>
      );
    }
    if (this.state.page === "team") {
      return (
        <div className="overlay">
          <div className="Dapp">
            <NavBar
              account={this.state.selectedAddress}
              connectWallet={() => this._connectWallet()}
              homePage={this.homePage}
              prizesPage={this.prizesPage}
              aboutPage={this.aboutPage}
              teamPage={this.teamPage}
            />
            <TeamPage account={this.state.selectedAddress} />
          </div>
          <div className="moving-background"></div>
        </div>
      );
    }

    if (this.state.page === "home") {
      return (
        <div className="overlay">
          <div className="Dapp">
            <NavBar
              account={this.state.selectedAddress}
              connectWallet={() => this._connectWallet()}
              homePage={this.homePage}
              prizesPage={this.prizesPage}
              aboutPage={this.aboutPage}
              teamPage={this.teamPage}
            />
            <MainLottery
              account={this.state.selectedAddress}
              deposit={this.deposit}
            />
          </div>
          <div className="moving-background"></div>
        </div>
      );
    }

    // If everything is loaded, we render the application.
    return (
      <div className="overlay">
        <div className="Dapp">
          <NavBar
            account={this.state.selectedAddress}
            connectWallet={() => this._connectWallet()}
            homePage={this.homePage}
            prizesPage={this.prizesPage}
            aboutPage={this.aboutPage}
            teamPage={this.teamPage}
          />
          <MainLottery
            account={this.state.selectedAddress}
            deposit={this.deposit}
          />
        </div>
        <div className="moving-background"></div>
      </div>
      // <div className="container p-4">
      //   <div className="row">
      //     <div className="col-12">
      //       <p>
      //         Welcome <b>{this.state.selectedAddress}!</b>
      //       </p>
      //     </div>
      //   </div>

      //   <hr />

      //   <div className="row">
      //     <div className="col-12">
      //       {/*
      //         Sending a transaction isn't an immediate action. You have to wait
      //         for it to be mined.
      //         If we are waiting for one, we show a message here.
      //       */}
      //       {this.state.txBeingSent && (
      //         <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
      //       )}

      //       {/*
      //         Sending a transaction can fail in multiple ways.
      //         If that happened, we show a message here.
      //       */}
      //       {this.state.transactionError && (
      //         <TransactionErrorMessage
      //           message={this._getRpcErrorMessage(this.state.transactionError)}
      //           dismiss={() => this._dismissTransactionError()}
      //         />
      //       )}
      //     </div>
      //   </div>
      // </div>
    );
  }

  componentWillUnmount() {
    this._stopPollingData();
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    this._initializeEthers();
    this._startPollingData();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider.
    this._lottery_contract = new ethers.Contract(
      contractAddress.Lottery,
      LotteryArtifact.abi,
      this._provider.getSigner(0)
    );

    // Initialize the DAI token contract.
    this._dai_contract = new ethers.Contract(
      this.state.daiAddr,
      IERC20Artifact.abi,
      this._provider.getSigner(0)
    );
  }

  /**
   * Deposit DAI into the contract.
   * @param amt the amount of DAI to deposit
   */
  async deposit(amt) {
    amt = BigNumber.from(amt);
    amt = amt.mul(DAI_FACTOR);

    // First, approve the DAI transfer to the lottery contract
    await this._doTransaction(this._dai_contract.approve, [
      contractAddress.Lottery,
      amt,
    ]);

    // Then do the actual deposit
    await this._doTransaction(this._lottery_contract.deposit, [
      this.state.aaveAddr,
      this.state.daiAddr,
      amt,
    ]);
  }

  /**
   * Withdraw all your DAI from the contract.
   */
  async withdraw() {
    // Call the contract withdraw function.
    await this._doTransaction(this._lottery_contract.withdraw, [
      this.state.aaveAddr,
      this.state.daiAddr,
    ]);
  }

  /**
   * Returns the user's current deposit.
   */
  async getUserDeposit() {
    let res = await this._lottery_contract.getUserDeposit();
    return await res.div(DAI_FACTOR).toString();
  }

  /**
   * Returns the user's current active deposit.
   */
  async getUserActiveDeposit() {
    let res = await this._lottery_contract.getUserActiveDeposit();
    return await res.div(DAI_FACTOR).toString();
  }

  /**
   * Returns the user's total prizes won.
   */
  async getUserTotalPrizesWon() {
    let res = await this._lottery_contract.getUserTotalPrizesWon();
    return await res.div(DAI_FACTOR).toString();
  }

  /**
   * Returns the current size of the pool.
   */
  async getPool() {
    let res = await this._lottery_contract.getPool();
    return await res.div(DAI_FACTOR).toString();
  }

  /**
   * Returns the current size of the active pool.
   */
  async getActivePool() {
    let res = await this._lottery_contract.getActivePool();
    return await res.div(DAI_FACTOR).toString();
  }

  /**
   * Returns the estimated next prize size.
   */
  async getEstimatedNextPrize() {
    let res = await this._lottery_contract.getEstimatedNextPrize(
      this.state.aaveAddr
    );
    if (isNaN(res)) {
      res = 0;
    }
    return await res.div(DAI_FACTOR).toString();
  }

  /**
   * Returns the unix timestamp of the last lottery.
   */
  async getLastLotteryTimestamp() {
    let res = await this._lottery_contract.getLastLotteryTimestamp();
    return await res.toString();
  }

  /**
   * Run the lottery.
   */
  async runLottery() {
    await this._doTransaction(this._lottery_contract.runLottery, [
      this.state.aaveAddr,
      this.state.daiAddr,
    ]);
  }

  /**
   * Wrapper function for making contract calls. This function will properly wait
   * for transactions to be completed and handle errors accordingly.
   * @param callback the transaction function to be called
   * @param args the list of arguments to be passed into callback
   */
  async _doTransaction(callback, args) {
    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await callback.apply(this, args);
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      // await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  // Start polling data that needs to be continuously updated
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._loadData(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._loadData();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // Load any data that needs to be continuously updated here
  _loadData() {}

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if MetaMask selected network is either Arbitrum Mainnet or Arbitrum Testnet
  _checkNetwork() {
    if (window.ethereum.networkVersion === ARBITRUM_MAINNET_NETWORK_ID) {
      this.state.aaveAddr = AAVE_MAINNET_ADDR;
      this.state.daiAddr = DAI_MAINNET_ADDR;
    } else if (window.ethereum.networkVersion === ARBITRUM_TESTNET_NETWORK_ID) {
      this.state.aaveAddr = AAVE_TESTNET_ADDR;
      this.state.daiAddr = DAI_TESTNET_ADDR;
    } else if (!(window.ethereum.networkVersion === HARDHAT_NETWORK_ID)) {
      this.setState({
        networkError:
          "Please set your MetaMask network to one of Arbitrum Mainnet, Arbitrum Testnet, or http://localhost:8545",
      });
      return false;
    }
    return true;
  }
}
