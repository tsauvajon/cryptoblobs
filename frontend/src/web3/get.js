let getWeb3 = () => new Promise(function (resolve, reject) {
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

                resolve({ ethereum })
            }, 1500)
        })
    })

export default getWeb3
