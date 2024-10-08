# AI Model Marketplace

This is a decentralized marketplace built on Ethereum that allows users to list, purchase, and rate AI models. Users can interact with the marketplace via MetaMask, purchasing models with Ether and leaving ratings. Developers can list their AI models for sale, and withdraw funds as needed.

## Features

- **Connect MetaMask**: Allows users to connect their wallet.
- **List AI Models**: Developers can list new AI models with a name, description, and price.
- **Purchase AI Models**: Users can purchase models using Ether.
- **Rate Models**: Users can rate models after purchasing.
- **Get Model Details**: Displays model details such as a name, decription, and so on.
- **Withdraw Funds**: Developers can withdraw earnings from their model sales.

## Technologies

- **Solidity**: For writing the smart contracts.
- **Web3.js**: To interact with Ethereum blockchain.
- **HTML/CSS/JavaScript**: For frontend UI.
- **MetaMask**: For connecting users' Ethereum wallet.

### Installing Ganache

Download and install Ganache from the [Ganache official website](https://trufflesuite.com/ganache/).

- Alternatively, you can use the CLI version of Ganache:

```bash
npm install -g ganache-cli
```

### Installing Truffle

Install Truffle globally using npm:

```bash
npm install -g truffle
```

## Setup and Installation

### Clone the repository

```
https://github.com/iliyaLL/AI-model-marketplace
cd AI-model-marketplace
```

### Start your local blockchain using Ganache:

ganache-cli

### Compile and deploy the smart contracts using Truffle

```bash
truffle compile
truffle migrate
```

## Examples


Connect:
![connect](img/connect.png)


List Model:
![listmodel](img/list.png)