async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy();
  await lottery.deployed();

  console.log("Lottery address:", lottery.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(lottery);
}

function saveFrontendFiles(lottery) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Lottery: lottery.address }, undefined, 2)
  );

  const LotteryArtifact = artifacts.readArtifactSync("Lottery");

  fs.writeFileSync(
    contractsDir + "/Lottery.json",
    JSON.stringify(LotteryArtifact, null, 2)
  );

  const IERC20Artifact = artifacts.readArtifactSync("IERC20");

  fs.writeFileSync(
    contractsDir + "/IERC20.json",
    JSON.stringify(IERC20Artifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
