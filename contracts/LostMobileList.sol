pragma solidity ^0.5.0;
contract LostMobileList{
    uint public lostMobileCount = 0;
    
    struct LostMobile {
    uint id;
    string IMEI;
    string mobileNumber;
    string location;
  }

  mapping(uint => LostMobile) public LostMobiles;

  event LostMobileAdded(
    uint id,
    string IMEI,
    string mobileNumber,
    string location
  );

  event LostMobileRemoved(
    string IMEI
  );

    
  event LostMobileEditted(
    uint id,
    string IMEI,
    string mobileNumber,
    string location  
  );
  
  function addLostMobile(string memory _IMEI,string memory _mobileNumber,string memory _location) public {
    lostMobileCount ++;
    LostMobiles[lostMobileCount] = LostMobile(lostMobileCount,_IMEI,_mobileNumber,_location);
    emit LostMobileAdded(lostMobileCount, _IMEI, _mobileNumber, _location);
  }

  function removeLostMobile(string memory _IMEI) public {
    for(uint i = 1; i<= lostMobileCount; i++){
        if(keccak256(abi.encodePacked(LostMobiles[i].IMEI)) == (keccak256(abi.encodePacked(_IMEI)))) {
            delete LostMobiles[i];
            break;
        }
    }
    lostMobileCount--;
    emit LostMobileRemoved(_IMEI);
  }

  function editLostMobile(string memory _IMEI,string memory _mobileNumber,string memory _location) public {
    for(uint i = 1; i<= lostMobileCount; i++){
        if(keccak256(abi.encodePacked(LostMobiles[i].IMEI)) == (keccak256(abi.encodePacked(_IMEI)))){
            LostMobiles[i] = LostMobile(i, _IMEI, _mobileNumber, _location);
            emit LostMobileEditted(i,_IMEI, _mobileNumber, _location);
            break;
        }
  }
}

}