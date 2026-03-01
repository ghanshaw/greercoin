# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GreerCoin is an ERC20-compliant Ethereum token with an ICO (Initial Coin Offering) demo. The repo has two parts:

1. **Smart contracts** (root) — Solidity contracts compiled and deployed via Truffle
2. **Frontend** (`client/`) — React app that interacts with the deployed contracts via Web3/MetaMask

## Commands

### Smart Contracts (run from root)
```bash
# Compile contracts
truffle compile

# Run contract tests
truffle test

# Run a single test file
truffle test test/GreercoinTest.js

# Deploy to local Ganache (port 7545)
truffle migrate --network develop

# Deploy to Ropsten or Mainnet (requires .env)
truffle migrate --network ropsten
truffle migrate --network mainnet
```

### Frontend (run from `client/`)
```bash
yarn start    # Start dev server
yarn build    # Production build
yarn test     # Run React tests
```

## Architecture

### Smart Contracts

- `contracts/GreerCoin.sol` — ERC20 token implementation (manual, no OpenZeppelin). Implements `transfer`, `transferFrom`, and `approve`/`allowance`.
- `contracts/GreerCoinSale.sol` — ICO sale contract. Admin deploys it with a reference to the GreerCoin contract and a token price (in wei). Buyers call `buyTokens(n)` sending exact ETH. Admin can call `endSale()` to recover remaining tokens and ETH.
- `migrations/2_deploy_contracts.js` — Reads config from `constants.js` (not committed; contains `name`, `symbol`, `decimals`, `standard`, and `test`/`prod` supply/price args). Deploys GreerCoin then GreerCoinSale, then transfers `icoSupply` tokens to the sale contract.
- Compiled ABIs are output to `client/src/contracts/` (configured in `truffle-config.js`).

### Frontend

- **Entry**: `client/src/App.js` — Sets up React Router with two routes: `/` (Landing/ICO page) and `/about`.
- **Web3 integration**: All blockchain logic lives in `client/src/components/landing/index.js`. It detects MetaMask (`window.ethereum`), instantiates Web3, loads contract instances from the ABI JSONs in `client/src/contracts/`, and reads/writes contract state. The component uses boolean "flag" state variables (e.g., `loadDataFlag`, `loadContractsFlag`) to coordinate async effects rather than calling async functions directly in effects.
- **Layout system**: `client/src/hooks/index.js` exports `useLayout`, a hook that computes responsive breakpoints (`xs/sm/md/lg/xl`) from window width. The result is provided via `LayoutContext` and consumed throughout to apply CSS class names (using `classnames`).
- **Modals**: `client/src/components/modals/` — A generic `Modal` wrapper with three content variants: `connection` (MetaMask connect flow), `purchase` (buy tokens form), `confirmation` (post-purchase tx hash display).
- **Styling**: SCSS modules per component. Global constants in `client/src/constants.scss`.
- **Absolute imports**: `client/jsconfig.json` sets `baseUrl` to `src/`, so imports like `components/button` resolve from `src/`.

### Environment & Networks

- Truffle networks: `develop` (Ganache, port 7545), `ropsten`, `mainnet`
- `.env` file (not committed) must provide `MNENOMIC_MAINNET`, `MNENOMIC_ROPSTEN`, and `INFURA_API_KEY`
- A `constants.js` file (not committed) at the root provides token metadata and supply/price parameters
- Deployed to Firebase Hosting (`client/firebase.json`, `client/.firebaserc`)
