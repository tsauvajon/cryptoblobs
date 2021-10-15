const Web3 = require('web3')
const CryptoBlobs = require('../../../build/contracts/CryptoBlobs.json')

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

    resolve({
        ethereum,
    })
})
    .then(result => {
        return new Promise(function (resolve, reject) {
            // TODO
            // window.ethereum is not immediately fully injected/initialised.
            // This setTimeout to sleep is a dumb solution and should be improved
            // INSTEAD: Subscribe to metamask hooks
            setTimeout(() => {
                const { ethereum } = result
                if (!ethereum.isConnected() || !ethereum.networkVersion) {
                    reject(new Error('Could not connect to Metamask, try reloading'))
                    return
                }

                // accepting both 4 and "4"
                if (ethereum.networkVersion != 4) {
                    reject(new Error('This application only runs on Rinkeby, please update your network on Metamask'))
                    return
                }

                // TODO: what if account changes?

                const web3 = new Web3(window.ethereum)
                window.web3 = web3 // set it in the window object to help with debugging

                resolve({ web3: new Web3(window.ethereum) })
            }, 1500)
        })
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
        throw new Error('The contract is not deployed!')
    }

    const cryptoBlobs = new web3.eth.Contract(CryptoBlobs.abi, address)
    window.cryptoBlobs = cryptoBlobs

    return cryptoBlobs
}

export { register, getContract }
