pragma solidity >=0.8.9;

// SPDX-License-Identifier: UNLICENSED

import "./BlobHelper.sol";
import "./erc721.sol";
import "./safemath.sol";

/// @author Thomas Sauvajon
/// @dev Compliant with OpenZeppelin's implementation of the ERC721 spec draft
contract CryptoBlobs is BlobHelper, ERC721 {
    using SafeMath for uint256;

    mapping(uint256 => address) blobApprovals;

    modifier onlyOwnerOf(uint256 _blobId) {
        require(msg.sender == blobToOwner[_blobId]);
        _;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerBlobCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return blobToOwner[_tokenId];
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) private {
        ownerBlobCount[_to] = ownerBlobCount[_to].add(1);
        ownerBlobCount[msg.sender] = ownerBlobCount[msg.sender].sub(1);
        blobToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        require(
            blobToOwner[_tokenId] == msg.sender ||
                blobApprovals[_tokenId] == msg.sender
        );
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId)
        external
        payable
        onlyOwnerOf(_tokenId)
    {
        blobApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}
