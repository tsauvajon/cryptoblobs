import Web3 from "web3"

class BlobContract {
    instance // make the instance available, to be able to access everything that is NOT wrapped by this class.

    constructor(contractInstance, toast) {
        this.instance = contractInstance
        this.toast = toast // toast notifier
    }

    // First, we get the ids of all owned blobs (OB) and blobs for sale (BFS).
    // For blobs in BFS but not in OB, we get price + owner.
    // For blobs in BFS and in OB, we get price only (since we know the owner already).
    // For blobs in OB only, we no nothing (there's no price to fetch and we know the owner)
    async getBlobs(account) {
        const ownedBlobsIds = await this.getOwnedBlobsIds(account)
        const blobsForSaleIds = await this.getBlobsForSaleIds()

        const blobMetadata = flatten(ownedBlobsIds, blobsForSaleIds)

        // Get all blob data (from their IDs) as an array of blobs.
        const blobsArray = (await Promise.all(
            Object.entries(blobMetadata).
                map(async ([id, { isOwned, isForSale }]) => await this.getBlob(id, account, isOwned, isForSale))
        )).filter(x => x !== undefined) // If fetching the blob fails, the function will return undefined.
        // We filter out these issues for now, but TODO: handle the error appropriately.;
        // Convert that array to a dict, where the key is the blob id and the value is the blob data.

        const blobs = blobsArray.reduce((prev, curr) => ({
            ...prev,
            [curr.id.toString()]: curr,
        }), {})

        return { ownedBlobsIds, blobsForSaleIds, blobs }
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

    async getBlobOwner(id) {
        const tx = await this.instance.methods.blobToOwner(id);
        let owner;
        try {
            owner = await tx.call();
        } catch (e) {
            console.error(e);
            this.toast.error(e.message);
            return;
        }

        return owner;
    }

    async getBlob(id, account, isOwned = false, isForSale = false) {
        const tx = await this.instance.methods.blobs(id);
        let blob;
        try {
            blob = await tx.call();
        } catch (e) {
            console.error(e);
            this.toast.error(e.message);
            return;
        }

        const price = isForSale ? await this.getBlobPrice(id) : '0'
        const owner = isOwned ? account : await this.getBlobOwner(id)

        blob = {
            ...blob,
            id,
            owner,
            price: (new Web3()).utils.fromWei(price.toString(), "ether"),
            name: blob[0],
            isOwned,
            isForSale,
        };

        return blob;
    }

    async getBlobIds(tx) {
        let ids;
        try {
            ids = await tx.call();
        } catch (e) {
            console.error(e);
            this.toast.error(e.message);
            return;
        }

        return ids
    }

    async getOwnedBlobsIds(account) {
        return await this.getBlobIds(await this.instance.methods.getBlobsByOwner(account));
    }

    async getBlobsForSaleIds() {
        return await this.getBlobIds(await this.instance.methods.getBlobsForSale());
    }
}

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
