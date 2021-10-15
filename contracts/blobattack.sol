pragma solidity >=0.8.9;

// SPDX-License-Identifier: UNLICENSED

import "./blobhelper.sol";

contract BlobAttack is BlobHelper {
    uint256 randNonce = 0;
    uint256 attackVictoryProbability = 70;

    function randMod(uint256 _modulus) internal returns (uint256) {
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % _modulus;
    }

    function attack(uint256 _blobId, uint256 _targetId)
        external
        onlyOwnerOf(_blobId)
    {
        Blob storage myBlob = blobs[_blobId];
        Blob storage enemyBlob = blobs[_targetId];
        uint256 rand = randMod(100);
        if (rand <= attackVictoryProbability) {
            myBlob.winCount++;
            myBlob.level++;
            enemyBlob.lossCount++;
            feedAndMultiply(_blobId, enemyBlob.dna, "blob");
        } else {
            myBlob.lossCount++;
            enemyBlob.winCount++;
            _triggerCooldown(myBlob);
        }
    }
}
