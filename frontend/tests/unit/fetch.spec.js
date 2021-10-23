import { flatten } from "@/blobs/fetch.js"

// TODO: mock Vuex to test Vue components
// https://forum.vuejs.org/t/testing-with-jest-vue-test-utils-vuex/26060


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
