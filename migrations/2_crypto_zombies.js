const CryptoZombies = artifacts.require("CryptoZombies");

module.exports = function (deployer) {
  deployer.deploy(CryptoZombies);
};
