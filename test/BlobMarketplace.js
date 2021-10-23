const BlobMarketplace = artifacts.require("BlobMarketplace");
const utils = require("./helpers/assert");
const time = require("./helpers/time");
const blobNames = ["Blob 1", "Blob 2"];

contract("BlobMarketplace", (accounts) => {
    let [alice, bob] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await BlobMarketplace.new();
    })

    it("lists a blob for sale", async () => {
        const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
        const blobId = result.logs[0].args.blobId.toNumber()

        let blobsOnSale = await contractInstance.getBlobsForSale()
        assert.strictEqual(blobsOnSale.length, 0)

        const price = 12345;
        await contractInstance.listBlobForSale(blobId, price);

        // There's one blob on sale
        blobsOnSale = await contractInstance.getBlobsForSale()
        assert.strictEqual(blobsOnSale.length, 1)
        assert.strictEqual(blobsOnSale[0].toNumber(), blobId)

        // The price is the one we listed it for
        blobPrice = await contractInstance.getBlobPrice(blobId)
        assert.strictEqual(blobPrice.toNumber(), price)
    })

    context("cancels a blob sale", () => {
        let blobId;

        beforeEach(async () => {
            const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
            blobId = result.logs[0].args.blobId.toNumber()

            const price = 12345;
            await contractInstance.listBlobForSale(blobId, price);
        })

        it("succeeds", async () => {
            await contractInstance.cancelBlobListing(blobId)

            const blobsOnSale = await contractInstance.getBlobsForSale()
            assert.strictEqual(blobsOnSale.length, 0)
        })

        it("cannot cancel someone else's sale", async () => {
            await utils.shouldThrow(contractInstance.cancelBlobListing(blobId, { from: bob }))
        })

        it("cannot cancel a sale if the blob is not for sale", async () => {
            const result = await contractInstance.createRandomBlob(blobNames[1], { from: alice });
            const blobId = result.logs[0].args.blobId.toNumber()
            await utils.shouldThrow(contractInstance.cancelBlobListing(blobId, { from: alice }))
        })
    })

    context("buying a blob", () => {
        let blobId;
        const price = 12345;
        beforeEach(async () => {
            contractInstance = await BlobMarketplace.new();

            const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
            blobId = result.logs[0].args.blobId.toNumber()

            await contractInstance.listBlobForSale(blobId, price);
        })

        it("buys a blob", async () => {
            await contractInstance.buyBlob(blobId, { from: bob, value: price })
            const owner = await contractInstance.ownerOf(blobId)

            // Owner changed
            assert.equal(owner, bob)

            // Blob is no longer on sale
            const blobsOnSale = await contractInstance.getBlobsForSale()
            assert.strictEqual(blobsOnSale.length, 0)
        })

        it("can't buy a blob that is not for sale", async () => {
            const result = await contractInstance.createRandomBlob(blobNames[1], { from: alice });
            const blob2Id = result.logs[0].args.blobId.toNumber()

            await utils.shouldThrow(contractInstance.buyBlob(blob2Id, { from: bob }))
        })

        it("can't buy a blob for less than its price", async () => {
            await utils.shouldThrow(contractInstance.buyBlob(blobId, { from: bob }))
        })

        it("can't buy a blob for more than its price to prevent mistakes", async () => {
            await utils.shouldThrow(contractInstance.buyBlob(blobId, { from: bob, value: price + 1 }))
        })

        it("can't put for sale a blob that is already up for sale", async () => {
            await utils.shouldThrow(contractInstance.listBlobForSale(blobId, price))
        })
    })
})
