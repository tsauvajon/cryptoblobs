# CryptoBlobs

[![Netlify Status](https://api.netlify.com/api/v1/badges/aee92005-5151-41bf-956b-4b49b29c24dc/deploy-status)](https://app.netlify.com/sites/cryptoblobs/deploys)

CryptoBlobs are randomly generated NFTs following the ERC-721 specification.

## Minting new CryptoBlobs
You can mint your own NFT (i.e. create a new one) on the Ethereum blockchain.  
You choose their names, but they'll have a random DNA and a random look.

![Minting NFTs](./docs/Minting.gif)


## Sending CryptoBlobs
You can send your CryptoBlobs to another wallet.
![Sending NFTs](./docs/Sending.gif)

## Acknowledgements

Blob SVG generation is from https://georgefrancis.dev/writing/generative-svg-blob-characters/.  
I made some minor adjustments for them to be deterministic (i.e. they don't change whenever you
reload the page) but the generation itself is really just a copy and paste.

CryptoBlob contracts are inspired by [CryptoZombies](https://cryptozombies.io/).
