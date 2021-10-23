import { BlobContract, flatten } from "@/blobs/fetch"

const consoleError = console.error

// Helper that will return a tx rejecting with a specified error message.
const rejectTxWithError = (msg) => () => ({
    call: () => new Promise((_, reject) => reject(new Error(msg)))
})

// Helper that will expect an error to be "toasted".
const toastExpectError = (expectedError) => ({
    error: (msg) => {
        expect(msg).toBe(expectedError)
    }
})

describe("BlobContract", () => {
    afterEach(() => {
        console.error = consoleError
    })

    const blobId = 123
    const examplePrice = "123456000000000000000"
    const exampleOwner = "0x481F83DB3cD7342364bf16FB4ABBD7978d09BaCe"

    // Mock getBlobPrice
    const getBlobPrice = (id) => {
        expect(id).toBe(blobId)
        return {
            call: () => new Promise((resolve) => resolve(examplePrice))
        }
    }

    // Mock blobToOwner
    const blobToOwner = (id) => {
        expect(id).toBe(blobId)
        return {
            call: () => new Promise((resolve) => resolve(exampleOwner))
        }
    }

    describe("getBlobPrice", () => {
        it("succeeds", async () => {
            const wantPrice = examplePrice

            const contract = new BlobContract({ methods: { getBlobPrice } })
            const got = await contract.getBlobPrice(blobId)
            expect(got).toBe(wantPrice)
        })

        it("propagates the error when it fails", async () => {
            console.error = jest.fn()
            const expectedError = "something went wrong"

            const contract = new BlobContract(
                { methods: { getBlobPrice: rejectTxWithError(expectedError) } },
                toastExpectError(expectedError),
            )
            await contract.getBlobPrice()

            expect(console.error).toHaveBeenCalled();
        })
    })

    describe("getBlobOwner", () => {
        it("succeeds", async () => {
            const wantOwner = exampleOwner

            const contract = new BlobContract({ methods: { blobToOwner } })
            const got = await contract.getBlobOwner(blobId)
            expect(got).toBe(wantOwner)
        })

        it("propagates the error when it fails", async () => {
            console.error = jest.fn()
            const expectedError = "something went wrong"

            const toast = {
                error: (msg) => {
                    expect(msg).toBe(expectedError)
                }
            }

            const contract = new BlobContract(
                { methods: { blobToOwner: rejectTxWithError(expectedError) } },
                toastExpectError(expectedError),
            )
            await contract.getBlobOwner()

            expect(console.error).toHaveBeenCalled();
        })
    })

    describe("getBlob", () => {
        const account = "0x5091e3774c2700C327Cc5D5E0D5AAAb72A513474"
        const returnedBlob = {
            [0]: "Mary" // name
        }
        const blobs = (id) => {
            expect(id).toBe(blobId)
            return {
                call: () => new Promise((resolve) => resolve(returnedBlob))
            }
        }

        it("not owned nor for sale", async () => {
            const contract = new BlobContract({ methods: { blobs, getBlobPrice, blobToOwner } })
            const got = await contract.getBlob(blobId, account, false, false)
            const wantBlob = {
                ...returnedBlob,
                id: blobId,
                isForSale: false,
                isOwned: false,
                name: "Mary",
                owner: exampleOwner,
                price: "0",
            }
            expect(got).toStrictEqual(wantBlob)
        })

        it("owned but not for sale", async () => {
            const contract = new BlobContract({ methods: { blobs, getBlobPrice, blobToOwner } })
            const got = await contract.getBlob(blobId, account, true, false)
            const wantBlob = {
                ...returnedBlob,
                id: blobId,
                isForSale: false,
                isOwned: true,
                name: "Mary",
                owner: account,
                price: "0",
            }
            expect(got).toStrictEqual(wantBlob)
        })

        it("for sale but not owned", async () => {
            const contract = new BlobContract({ methods: { blobs, getBlobPrice, blobToOwner } })
            const got = await contract.getBlob(blobId, account, false, true)
            const wantBlob = {
                ...returnedBlob,
                id: blobId,
                isForSale: true,
                isOwned: false,
                name: "Mary",
                owner: exampleOwner,
                price: "123.456",
            }
            expect(got).toStrictEqual(wantBlob)
        })

        it("for sale and owned", async () => {
            const contract = new BlobContract({ methods: { blobs, getBlobPrice, blobToOwner } })
            const got = await contract.getBlob(blobId, account, true, true)
            const wantBlob = {
                ...returnedBlob,
                id: blobId,
                isForSale: true,
                isOwned: true,
                name: "Mary",
                owner: account,
                price: "123.456",
            }
            expect(got).toStrictEqual(wantBlob)
        })

        it("propagates the error when it fails", async () => {
            console.error = jest.fn()
            const expectedError = "something went wrong"

            const contract = new BlobContract(
                { methods: { blobs: rejectTxWithError(expectedError) } },
                toastExpectError(expectedError),
            )
            await contract.getBlob()
            expect(console.error).toHaveBeenCalled();
        })
    })
})

it("flattens arrays to metadata", () => {
    const testCases = [
        {
            ownedIds: [],
            forSaleIds: [],
            want: {},
        }, {
            ownedIds: [1],
            forSaleIds: [2],
            want: {
                1: { isOwned: true },
                2: { isForSale: true },
            },
        }, {
            ownedIds: [10],
            forSaleIds: [],
            want: {
                10: { isOwned: true },
            },
        }, {
            ownedIds: [],
            forSaleIds: [5],
            want: {
                5: { isForSale: true },
            },
        }, {
            ownedIds: [1, 2],
            forSaleIds: [2, 3],
            want: {
                1: { isOwned: true },
                2: { isOwned: true, isForSale: true },
                3: { isForSale: true },
            },
        }, {
            ownedIds: [1, 2],
            forSaleIds: [1, 2],
            want: {
                1: { isOwned: true, isForSale: true },
                2: { isOwned: true, isForSale: true },
            },
        }
    ]

    testCases.forEach(testCase => {
        const got = flatten(testCase.ownedIds, testCase.forSaleIds)
        expect(got).toStrictEqual(testCase.want)
    })
})
