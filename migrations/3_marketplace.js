const BlobMarketplace = artifacts.require("BlobMarketplace");

module.exports = function (deployer) {
  deployer.deploy(BlobMarketplace);
};
