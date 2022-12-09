pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2; //typeerror ke liye tha

contract LostMobileList{
    uint public lostMobileCount = 0;
    
    struct LostMobile {
    uint id;
    string IMEI;
    string mobileNumber;
    string location;
  }

  mapping(uint => LostMobile) public LostMobiles;

  //will optimise subha
  struct Operator{
    string operator;
    uint weight; //1: edit, add, delete, 2: GSM
  }
  mapping(address=> Operator) public users; //map for address and users
  address public gsm;

  constructor() public {
    gsm=msg.sender;
    users[msg.sender].weight=2;

  }
  function addOperator(address addr, Operator memory company) public {
     require(msg.sender==gsm,'Must be GSM');
      users[addr]=company;
  }
  function removeOperator(address addr, Operator memory company) public {
    require(msg.sender==gsm,'Must be GSM');
    delete(users[addr]);
    
  }


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
    require(user[msg.sender].weight>=1,'Only Operators can add Lost Mobiles');
    lostMobileCount ++;
    LostMobiles[lostMobileCount] = LostMobile(lostMobileCount,_IMEI,_mobileNumber,_location);
    emit LostMobileAdded(lostMobileCount, _IMEI, _mobileNumber, _location);
  }

  function removeLostMobile(string memory _IMEI) public {
    require(user[msg.sender].weight>=1,'Only Operators and GSM can remove Lost Mobiles');
    for(uint i = 1; i<= lostMobileCount; i++){
        if(keccak256(abi.encodePacked(LostMobiles[i].IMEI)) == (keccak256(abi.encodePacked(_IMEI)))) {
            delete LostMobiles[i];
            break;
        }
    }
    lostMobileCount--;
    emit LostMobileRemoved(_IMEI);
  }

 

}