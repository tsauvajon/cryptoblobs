pragma solidity >=0.8.9;

// SPDX-License-Identifier: UNLICENSED

import "./blobfactory.sol";

interface KittyInterface {
    function getKitty(uint256 _id)
        external
        view
        returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
        );
}

contract BlobFeeding is BlobFactory {
    KittyInterface kittyContract;

    modifier onlyOwnerOf(uint256 _blobId) {
        require(msg.sender == blobToOwner[_blobId]);
        _;
    }

    function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
    }

    function _triggerCooldown(Blob storage _blob) internal {
        _blob.readyTime = uint32(block.timestamp + cooldownTime);
    }

    function _isReady(Blob storage _blob) internal view returns (bool) {
        return (_blob.readyTime <= block.timestamp);
    }

    function feedAndMultiply(
        uint256 _blobId,
        uint256 _targetDna,
        string memory _species
    ) internal onlyOwnerOf(_blobId) {
        Blob storage myBlob = blobs[_blobId];
        require(_isReady(myBlob));
        _targetDna = _targetDna % dnaModulus;
        uint256 newDna = (myBlob.dna + _targetDna) / 2;
        if (
            keccak256(abi.encodePacked(_species)) ==
            keccak256(abi.encodePacked("kitty"))
        ) {
            newDna = newDna - (newDna % 100) + 99;
        }
        _createBlob("NoName", newDna);
        _triggerCooldown(myBlob);
    }

    function feedOnKitty(uint256 _blobId, uint256 _kittyId) public {
        uint256 kittyDna;
        (, , , , , , , , , kittyDna) = kittyContract.getKitty(_kittyId);
        feedAndMultiply(_blobId, kittyDna, "kitty");
    }
}
