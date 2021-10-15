pragma solidity >=0.6.0;

// SPDX-License-Identifier: UNLICENSED

import "./blobfeeding.sol";

contract BlobHelper is BlobFeeding {
    uint256 levelUpFee = 0.001 ether;

    modifier aboveLevel(uint256 _level, uint256 _blobId) {
        require(blobs[_blobId].level >= _level);
        _;
    }

    function withdraw() external onlyOwner {
        address _owner = owner();
        payable(_owner).transfer(address(this).balance);
    }

    function setLevelUpFee(uint256 _fee) external onlyOwner {
        levelUpFee = _fee;
    }

    function levelUp(uint256 _blobId) external payable {
        require(msg.value == levelUpFee);
        blobs[_blobId].level = blobs[_blobId].level + 1;
    }

    function changeName(uint256 _blobId, string calldata _newName)
        external
        aboveLevel(2, _blobId)
        onlyOwnerOf(_blobId)
    {
        blobs[_blobId].name = _newName;
    }

    function changeDna(uint256 _blobId, uint256 _newDna)
        external
        aboveLevel(20, _blobId)
        onlyOwnerOf(_blobId)
    {
        blobs[_blobId].dna = _newDna;
    }

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
