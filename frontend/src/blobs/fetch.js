class BlobContract {
    instance

    constructor(contractInstance, toast) {
        this.instance = contractInstance
        this.toast = toast // toast notifier
    }

    async getBlobPrice(id) {
        const tx = await this.instance.methods.getBlobPrice(id);
        let price;
        try {
            price = await tx.call();
        } catch (e) {
            console.error(e);
            this.toast.error(e.message);
            return;
        }

        return price;
    }
}

// const getBlobOwner = async (id) => {
//     const tx = await this.state.contractInstance.methods.blobToOwner(id);
//     let owner;
//     try {
//         owner = await tx.call();
//     } catch (e) {
//         console.error(e);
//         Vue.$toast.error(e.message);
//         return;
//     }

//     return owner;
// }

// const getBlob = async (id, isOwned = false, isForSale = false) => {
//     const tx = await this.state.contractInstance.methods.blobs(id);
//     let blob;
//     try {
//         blob = await tx.call({ from: account });
//     } catch (e) {
//         console.error(e);
//         Vue.$toast.error(e.message);
//         return;
//     }

//     const price = isForSale ? await getBlobPrice(id) : 0
//     const owner = isOwned ? account : await getBlobOwner(id)

//     blob = {
//         ...blob,
//         id,
//         owner,
//         price: web3.utils.fromWei(price.toString(), "ether"),
//         name: blob[0],
//         isOwned,
//         isForSale,
//     };

//     return blob;
// }

// const getBlobs = async (tx) => {
//     let ids;
//     try {
//         ids = await tx.call({ from: account });
//     } catch (e) {
//         console.error(e);
//         Vue.$toast.error(e.message);
//         return;
//     }

//     return ids
// }

// Flatten the arrays.
// Example:
// const ownedBlobs = [1,2]
// const blobsForSale = [2,3]
// blobMetadata = {
//   1: {isOwned: true},
//   2: {isForSale: true, isOwned: true},
//   3: {isForSale: true}
// }
const flatten = (owned, forSale) => owned.reduce((prev, curr) => ({
    ...prev,
    [curr]: {
        ...prev[curr],
        isOwned: true,
    }
}), forSale.reduce((prev, curr) => ({
    ...prev,
    [curr]: { isForSale: true }
}), {}));

export { BlobContract, flatten }
