const Web3 = require('web3')
const CryptoBlobs = require('../../../build/contracts/BlobMarketplace.json')

let register = () => new Promise(function (resolve, reject) {
    // Metamask injects its web3 instance into window.ethereum
    const ethereum = window.ethereum
    if (typeof ethereum === 'undefined') {
        reject(new Error('Please install Metamask'))
        return
    }

    if (!ethereum.isMetaMask) {
        reject(new Error('This app only works with Metamask, but you use another wallet'))
        return
    }

    const web3 = new Web3(ethereum)
    window.web3 = web3 // set it in the window object to help with debugging

    resolve({ web3 })
})

async function getContract(web3) {
    if (!web3) {
        throw new Error('missing parameter web3')
    }

    // The contract needs to be deployed to the network we're logged in!
    const network = web3.currentProvider.networkVersion

    let address
    try {
        address = CryptoBlobs.networks[network].address
    } catch (e) {
        console.error(e)
        throw new Error('The contract is not deployed!')
    }

    const cryptoBlobs = new web3.eth.Contract(CryptoBlobs.abi, address)
    window.cryptoBlobs = cryptoBlobs

    return cryptoBlobs
}

export { register, getContract }
