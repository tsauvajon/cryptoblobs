pragma solidity >=0.6.0;

// SPDX-License-Identifier: UNLICENSED

import "./BlobFactory.sol";

contract BlobHelper is BlobFactory {
    function getBlobsByOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](ownerBlobCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < blobs.length; i++) {
            if (blobToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
