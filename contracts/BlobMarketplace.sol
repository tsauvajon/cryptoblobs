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

        // emit event? So we can subscribe on them: https://web3js.readthedocs.io/en/v1.2.7/web3-eth-subscribe.html#web3-eth-subscribe
    }

    function _cancelBlobListing(uint256 _blobId) private {
        delete listings[_blobId];
        listingCount--;
    }

    function cancelBlobListing(uint256 _blobId)
        external
        payable
        onlyOwnerOf(_blobId)
        forSale(_blobId)
    {
        _cancelBlobListing(_blobId);
    }

    function buyBlob(uint256 _blobId) external payable forSale(_blobId) {
        require(msg.value == listings[_blobId]);

        address owner = blobToOwner[_blobId];

        ownerBlobCount[msg.sender]++;
        ownerBlobCount[owner]--;
        blobToOwner[_blobId] = msg.sender;

        emit Transfer(owner, msg.sender, _blobId);

        payable(owner).transfer(msg.value);

        _cancelBlobListing(_blobId);
    }
}
