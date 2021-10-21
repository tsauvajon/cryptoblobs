const CryptoBlobs = artifacts.require("CryptoBlobs");
const utils = require("./helpers/utils");
const time = require("./helpers/time");
const blobNames = ["Blob 1", "Blob 2"];

contract("CryptoBlobs", (accounts) => {
    let [alice, bob] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await CryptoBlobs.new();
    })

    it("should be able to create a new blob", async () => {
        const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.name, blobNames[0]);
    })

    it("should not allow more than five blobs", async () => {
        await contractInstance.createRandomBlob(blobNames[0], { from: alice });
        await contractInstance.createRandomBlob(blobNames[0], { from: alice });
        await contractInstance.createRandomBlob(blobNames[0], { from: alice });
        await contractInstance.createRandomBlob(blobNames[1], { from: alice });
        await contractInstance.createRandomBlob(blobNames[1], { from: alice });
        await utils.shouldThrow(contractInstance.createRandomBlob(blobNames[1], { from: alice }));
    })

    context("with the single-step transfer scenario", async () => {
        it("should transfer a blob", async () => {
            const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
            const blobId = result.logs[0].args.blobId.toNumber();
            await contractInstance.transferFrom(alice, bob, blobId, { from: alice });
            const newOwner = await contractInstance.ownerOf(blobId);
            assert.equal(newOwner, bob);
        })
    })

    context("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a blob when the approved address calls transferFrom", async () => {
            const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
            const blobId = result.logs[0].args.blobId.toNumber();
            await contractInstance.approve(bob, blobId, { from: alice });
            await contractInstance.transferFrom(alice, bob, blobId, { from: bob });
            const newOwner = await contractInstance.ownerOf(blobId);
            assert.equal(newOwner, bob);
        })

        it("should approve and then transfer a blob when the owner calls transferFrom", async () => {
            const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
            const blobId = result.logs[0].args.blobId.toNumber();
            await contractInstance.approve(bob, blobId, { from: alice });
            await contractInstance.transferFrom(alice, bob, blobId, { from: alice });
            const newOwner = await contractInstance.ownerOf(blobId);
            assert.equal(newOwner, bob);
        })
    })
})
