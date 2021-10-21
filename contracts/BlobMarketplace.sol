// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

import "./CryptoBlobs.sol";
import "./safemath.sol";

/// @author Thomas Sauvajon
contract BlobMarketplace is CryptoBlobs {
    using SafeMath for uint256;

    mapping(uint256 => uint256) public listings;
    uint256 listingCount = 0;

    function getBlobPrice(uint256 _tokenId) external view returns (uint256) {
        return listings[_tokenId];
    }

    function getBlobsForSale() external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](listingCount);
        uint256 i = 0;
        for (uint256 blobId = 0; blobId < blobs.length; blobId++) {
            // if the blob is listed for sale
            if (listings[blobId] > 0) {
                result[i] = blobId;
                i++;
            }
        }
        return result;
    }

    function listBlobForSale(uint256 _tokenId, uint256 price)
        external
        payable
        onlyOwnerOf(_tokenId)
    {
        assert(price != 0);
        assert(listings[_tokenId] == 0); // there's no listing for this blob

        listings[_tokenId] = price;
        listingCount++;

        // emit event? TODO: look at what Events are for
    }

    function cancelBlobListing(uint256 _tokenId)
        external
        payable
        onlyOwnerOf(_tokenId)
    {
        assert(listings[_tokenId] != 0); // there's a listing for this blob

        delete listings[_tokenId];
        listingCount--;
    }

    // function buy
}
