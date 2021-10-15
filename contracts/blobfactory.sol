pragma solidity >=0.8.9;

// SPDX-License-Identifier: UNLICENSED

import "./ownable.sol";
import "./safemath.sol";

contract BlobFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewBlob(uint256 blobId, string name, uint256 dna);

    uint256 dnaDigits = 16;
    uint256 dnaModulus = 10**dnaDigits;
    uint256 cooldownTime = 1 minutes;
    uint256 maxBlobs = 5;

    struct Blob {
        string name;
        uint256 dna;
        uint32 level;
        uint32 readyTime;
        uint16 winCount;
        uint16 lossCount;
    }

    Blob[] public blobs;

    mapping(uint256 => address) public blobToOwner;
    mapping(address => uint256) ownerBlobCount;

    function _createBlob(string memory _name, uint256 _dna) internal {
        blobs.push(
            Blob(_name, _dna, 1, uint32(block.timestamp + cooldownTime), 0, 0)
        );
        uint256 id = blobs.length - 1;

        blobToOwner[id] = msg.sender;
        ownerBlobCount[msg.sender]++;
        emit NewBlob(id, _name, _dna);
    }

    function _generateRandomDna(string memory _str)
        private
        view
        returns (uint256)
    {
        uint256 rand = uint256(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    function createRandomBlob(string memory _name) public {
        require(ownerBlobCount[msg.sender] < maxBlobs);
        uint256 randDna = _generateRandomDna(_name);
        randDna = randDna - (randDna % 100);
        _createBlob(_name, randDna);
    }
}
