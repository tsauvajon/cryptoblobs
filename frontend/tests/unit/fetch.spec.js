import { BlobContract, flatten } from "@/blobs/fetch"

// TODO: mock Vuex to test Vue components
// https://forum.vuejs.org/t/testing-with-jest-vue-test-utils-vuex/26060

const consoleError = console.error

describe("getBlobPrice", () => {
    afterEach(() => {
        console.error = consoleError
    })

    const blobId = 123

    it("succeeds", async () => {
        const wantPrice = "0000011123000000"
        const getBlobPrice = (id) => {
            expect(id).toBe(blobId)
            return {
                call: () => new Promise((resolve) => resolve(wantPrice))
            }
        }

        const contract = new BlobContract({ methods: { getBlobPrice } })
        const got = await contract.getBlobPrice(blobId)
        expect(got).toBe(wantPrice)
    })

    it("propagates the error when it fails", async () => {
        console.error = jest.fn()
        const expectedError = "something went wrong"
        const getBlobPrice = () => ({
            call: () => new Promise((_, reject) => reject(new Error(expectedError)))
        })

        const toast = {
            error: (msg) => {
                expect(msg).toBe(expectedError)
            }
        }

        const contract = new BlobContract({ methods: { getBlobPrice } }, toast)
        await contract.getBlobPrice()

        expect(console.error).toHaveBeenCalled();
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
