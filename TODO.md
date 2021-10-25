Deploy on a L2 (Matic/xDAI)

Host the webapp on IPFS

Mock Vuex to test Vue components: https://forum.vuejs.org/t/testing-with-jest-vue-test-utils-vuex/26060

Migrate to TypeScript

Have `BlobContract`, not `contractInstance`, in the state

Lint contracts (as a yarn command and a GH Action)

Automate test coverage checks (solidity-coverage + Coveralls for example)

Smart contract security analysis (smartbugs)

Refactor `blobs/generate.js` to:
- be a Vue component instead
- be deterministic: be able to get all characteristics before drawing the image
- if possible, don't write directly to the DOM but use Vue instead to generate the SVG

Add blob characteristics (hat, glasses...)

Allow different background from blob color

Add rare background colors (e.g. 2% of blobs can have XXX characteristic)

Limit the overall number of blobs?

Feature: Router
- Split "My blobs", "Marketplace", "Blob page", "Account page"
- Be able to send links to share relevant things!
