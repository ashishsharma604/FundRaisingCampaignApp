pragma solidity ^0.4.17;

contract CampaginFactory {

    address[] public deployedCampagins;

    function createCampaign(uint minimum) public {

       address newCampaign =  new Campagin(minimum, msg.sender);
       deployedCampagins.push(newCampaign);
    }

    function getDeployedCampagins() public view returns (address[]) {

        return deployedCampagins;
    }
}


contract Campagin {

    struct Request {

        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool)  approvals;

    }

    //address of the person who is creating contract
    address public manager;

    //minimumContribution to participate in Campagin
    uint public minimumContribution;

    //list of all the address who contributed money and
    //eligible for the approve the request
    mapping(address => bool) public approvers;

    uint public approversCount;

    //struct type of array
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }


    function Campagin(uint minimum, address creator) public {

        manager = creator;
        minimumContribution = minimum;

    }

/*
    this method will first check if the contributed money is
    more than the minimumContribution and if yes than it will add
    contibuter into the array of approvers */

    function contributeMoney() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }



    function createRequest(string description, uint value, address recipient) public restricted {


        Request memory newRequest = Request({
         // when we initialize structs, we only have to initialize
         // values type.
         //there is no need to initialize address/reference types(mapping)
           description : description,
           value : value,
           recipient : recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }
    /*

    */
    function approveRequest(uint index) public {

      Request storage request = requests[index];

      require(approvers[msg.sender]);
      require(!request.approvals[msg.sender]);

      request.approvals[msg.sender] = true;
      request.approvalCount++;

    }


    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount/2) );
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }





}
