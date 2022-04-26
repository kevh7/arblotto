# ArbLotto

ArbLotto is a decentralized "no-loss" lottery that operates as a dApp on the Ethereum Layer 2 Arbitrum. The motivation behind this project is to create a lottery that is accessible to everyone while also encouraging saving money. Although generally lotteries should not be marketed towards everyone from a moral standpoint, this lottery is unique in that it is "no risk" because users can withdraw the cost of entry after the lottery is over (or at any time to exit the lottery). The core idea that allows this is that prizes are sourced solely from the combined interest earned from supplying the combined total of all users deposits.

By running on the Arbitrum network, users can benefit from near-zero fees while still having the convenience and safety guarantees that come with Ethereum, making ArbLotto as accessible as possible.

## Quick start

Clone this repository and install the node dependencies.

```sh
git clone https://github.com/kevh7/arblotto.git
cd arblotto
npm install
```

Set your private key in a `.env` file. You can get the private key for an account in MetaMask by going to `Account Options` > `Account Details` > `Export Private Key`.

```sh
echo PRIVATE_KEY='"YOUR_PRIVATE_KEY_HERE"' > .env
```

## Deploying to a local Hardhat network

To deploy to a local Hardhat network, you'll need to spin up a Hardhat instance first before deploying your contract.

```sh
npx hardhat node # run this in a separate terminal
npx hardhat run scripts/deploy.js --network localhost
```

## Deploying to Arbitrum Testnet

The account corresponding to your private key will be used for deployment, so it must have enough bridged Ether on the Arbritrum Testnet to deploy a contract.

> ### Obtaining bridged Ether on the Arbitrum Testnet
>
> First, obtain Rinkeby Ether (you can use a [Rinkeby faucet](https://rinkebyfaucet.com/)). Set your MetaMask network to the `Rinkeby Test Network` and use the [official bridge](https://bridge.arbitrum.io/) to bridge your Rinkeby Ether to Arbitrum Testnet Ether. Once your bridged Ether has arrived on the Testnet, you can deploy the contract.

```sh
npx hardhat run scripts/deploy.js --network arbitrum_testnet
```

## Deploying to Arbitrum Mainnet

The account corresponding to your private key will be used for deployment, so it must have enough bridged Ether on the Arbritrum Mainnet to deploy a contract.

```sh
npx hardhat run scripts/deploy.js --network arbitrum
```

## Running the frontend

Note that the frontend needs the contract address and ABI which is filled in automatically by the deployment script, so you'll need to deploy the contract before running the frontend.

```sh
cd frontend
npm install
npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser. You will
need to have [MetaMask](https://metamask.io/) installed and configured to the Arbitrum network.

If this is your first time using MetaMask with Arbitrum, you will need to add the network to MetaMask. Go to `Settings` > `Networks` > `Add a network` and enter the configuation for the [Arbitrum Mainnet](https://developer.offchainlabs.com/docs/mainnet#connect-your-wallet) and/or the [Arbitrum Testnet](https://developer.offchainlabs.com/docs/public_testnet#connecting-to-the-chain).
