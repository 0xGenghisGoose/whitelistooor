import * as dotenv from "dotenv";
import * as toml from "toml";
import { HardhatUserConfig, subtask } from "hardhat/config";
import { readFileSync } from "fs";
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
dotenv.config();

// default values here to avoid failures when running hardhat
const RINKEBY_RPC = process.env.ALCHEMY_RINKEBY_URL || "1".repeat(32);
const PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "1".repeat(64);
const SOLC_DEFAULT = "0.8.10";

// try use forge config
let foundry: any;
try {
  foundry = toml.parse(readFileSync("./foundry.toml").toString());
  foundry.default.solc = foundry.default["solc-version"]
    ? foundry.default["solc-version"]
    : SOLC_DEFAULT;
} catch (error) {
  foundry = {
    default: {
      solc: SOLC_DEFAULT,
    },
  };
}

// prune forge style tests from hardhat paths
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(
  async (_, __, runSuper) => {
    const paths = await runSuper();
    return paths.filter((p: string) => !p.endsWith(".t.sol"));
  }
);

const config: HardhatUserConfig = {
  paths: {
    cache: "cache-hardhat",
    sources: "./src",
    tests: "./integration",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: { chainId: 1337 },
    rinkeby: {
      url: RINKEBY_RPC,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: {
    version: foundry.default?.solc || SOLC_DEFAULT,
    settings: {
      optimizer: {
        enabled: foundry.default?.optimizer || true,
        runs: foundry.default?.optimizer_runs || 200,
      },
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 77,
    excludeContracts: ["src/test"],
    coinmarketcap: process.env.CMC_KEY ?? "",
  },
};

export default config;
