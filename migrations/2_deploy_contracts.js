const LostMobileList = artifacts.require("../contracts/LostMobileList.sol");

module.exports = function(deployer) {
  deployer.deploy(LostMobileList);
};
