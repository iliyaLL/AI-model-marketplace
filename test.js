const response = await fetch('./build/contracts/AIModelMarketplace.json');
const configuration = await response.json();
const CONTRACT_ABI = configuration.abi;
const CONTRACT_ADDRESS = configuration.networks[5777].address;

console.log(CONTRACT_ADDRESS, CONTRACT_ABI);

let contract;
let web3;

window.addEventListener('load', async (event) => {
    if (typeof window.ethereum !== 'undefined') {
        // Initialize web3 using the MetaMask provider
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        const connectButton = document.getElementById('connectButton');
        const walletAddressDisplay = document.getElementById('walletAddress');

        async function connectWallet() {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                walletAddressDisplay.textContent = `Wallet Address: ${accounts[0]}`;
            } catch (error) {
                walletAddressDisplay.textContent = 'Error connecting to MetaMask.';
            }
        }

        connectButton.addEventListener('click', connectWallet);
    } else {
        alert('MetaMask is not installed. Please install MetaMask and refresh the page.');
    }
});


document.getElementById('listModelForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('modelName').value;
    const description = document.getElementById('modelDescription').value;
    const price = web3.utils.toWei(document.getElementById('modelPrice').value, 'ether');
    const accounts = await web3.eth.getAccounts();

    await contract.methods.listModel(name, description, price).send({ from: accounts[0] });
    alert('Model listed successfully!');
});

// Purchase Model
document.getElementById('purchaseModelForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const modelId = document.getElementById('purchaseModelId').value;

    const model = await contract.methods.models(modelId).call();
    const accounts = await web3.eth.getAccounts();
    await contract.methods.purchaseModel(modelId).send({ from: accounts[0], value: model.price });
    alert('Model purchased successfully!');
});

// Rate Model
document.getElementById('rateModelForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const modelId = document.getElementById('rateModelId').value;
    const rating = document.getElementById('rating').value;
    const accounts = await web3.eth.getAccounts();

    await contract.methods.rateModel(modelId, rating).send({ from: accounts[0] });
    alert('Model rated successfully!');
});

// Withdraw Funds
document.getElementById('withdrawButton').addEventListener('click', async (e) => {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.withdrawFunds().send({ from: accounts[0] });
        alert('Funds withdrawn successfully!');
    } catch (e) {
        alert('Error');
    }
});

// Get Model Details
document.getElementById('getModelForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const modelId = document.getElementById('modelId').value;

    const details = await contract.methods.getModelDetails(modelId).call();
    const detailsText = `Name: ${details[0]}, Description: ${details[1]}, Price: ${details[2]} Wei, Creator: ${details[3]}, Purchased: ${details[4]}, Rating: ${details[5]}`;
    document.getElementById('modelDetails').textContent = detailsText;
});

// Get Withdraw Funds
document.getElementById('showUserFunds').addEventListener('click', async (e) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const userFunds = await contract.methods.userFunds(accounts[0]).call();

        const fundsDisplay = document.getElementById('userFundsDisplay');
        fundsDisplay.textContent = `Your available funds: ${web3.utils.fromWei(userFunds, 'ether')} ETH`;
    } catch (e) {
        alert('Error retrieving funds. Please try again.');
    }
})