// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

import "./CryptoBlobs.sol";
import "./safemath.sol";

/// @author Thomas Sauvajon
contract BlobMarketplace is CryptoBlobs {
    using SafeMath for uint256;

    mapping(uint256 => uint256) public listings;
    uint256 listingCount = 0;

    modifier forSale(uint256 _blobId) {
        require(listings[_blobId] != 0);
        _;
    }

    function getBlobPrice(uint256 _blobId)
        external
        view
        forSale(_blobId)
        returns (uint256)
    {
        return listings[_blobId];
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

    function listBlobForSale(uint256 _blobId, uint256 price)
        external
        payable
        onlyOwnerOf(_blobId)
    {
        require(listings[_blobId] == 0); // must not be already for sale
        assert(price > 0);

        listings[_blobId] = price;
        listingCount++;

        // emit event? TODO: look at what Events are for
    }

    function cancelBlobListing(uint256 _blobId)
        external
        payable
        onlyOwnerOf(_blobId)
        forSale(_blobId)
    {
        delete listings[_blobId];
        listingCount--;
    }
}
