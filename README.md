# CryptoBlobs

CryptoBlobs are randomly generated NFTs following the ERC-721 specification.

You can mint them (create new ones):
![Minting NFTs](./docs/Minting.gif)

You choose their names, but they'll have a random DNA and a random look.

You can also send them to other people:
![Sending NFTs](./docs/Minting.gif)

## Acknowledgements

Blob SVG generation is from https://georgefrancis.dev/writing/generative-svg-blob-characters/.  
I made some minor adjustments for them to be deterministic (i.e. they don't change whenever you
reload the page) but the generation itself is really just a copy and paste.

CryptoBlob contracts are largely inspired by [CryptoZombies](https://cryptozombies.io/).
