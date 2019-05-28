const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3')
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaginFactory.json');
const compiledCampagin = require('../ethereum/build/Campagin.json');


let accounts;
let factory;
let campaignAddress;
let campaign;


beforeEach(async () => {

  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
  .deploy({data: compiledFactory.bytecode})
  .send({from: accounts[0], gas:'1000000'});

  await factory.methods.createCampaign('100').send({

    from: accounts[0],
    gas: '1000000'
  });

  const addresses = await factory.methods.getDeployedCampagins().call();
  campaignAddress = addresses[0];

  campaign = await new web3.eth.Contract(JSON.parse(compiledCampagin.interface),campaignAddress);
});

describe('Campagins', () => {

  it('deploys a factory and a Campagin', () => {

    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager',async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);

  });

  it('money contributed ',async () => {

    await campaign.methods.contributeMoney().send({

      from: accounts[1],
      value: '1000'
    });
  });

  if('requires a minimum contribution',async () => {
    try {
      await campaign.methods.contributeMoney().send({
        from: accounts[1],
        value: '5'
      });
    }
    catch(err) {
      assert(err);
    }
  });

  it('contributer has become approver',async () => {
      const approver = await campaign.methods.approvers(accounts[1]).call();

      assert(approver);
    });
});
