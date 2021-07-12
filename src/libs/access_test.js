const AccessController = require('orbit-db-access-controllers/src/access-controller-interface')

// const isValidEthAddress = require('./utils/is-valid-eth-address')
const io = require('orbit-db-io')
const abi = [{"type":"function",
"stateMutability":"view",
"payable":false,
"outputs":[{"type":"address","name":"delegateKey"},
{"type":"uint256","name":"shares"},
{"type":"uint256","name":"loot"},
{"type":"bool","name":"exists"},
{"type":"uint256","name":"highestIndexYesVote"},
{"type":"uint256","name":"jailed"}],
"name":"members",
"inputs":[{"type":"address","name":""}],
"constant":true}]

export default class DaoHausController extends AccessController {
    constructor (ipfs, web3, address, defaultAccount) {
      super()
      this._ipfs = ipfs
      this.web3 = web3
      this.abi = abi
      this.contractAddress = address
      this.defaultAccount = defaultAccount
    }

    static get type () { return 'othertype' } // Return the type for this controller

    get address () {
      return this.contractAddress
    }


    async load (address) {
      if (address) {
        try {
          if (address.indexOf('/ipfs') === 0) { address = address.split('/')[2] }
          const access = await io.read(this._ipfs, address)
          this.contractAddress = access.contractAddress
          this.abi = JSON.parse(access.abi)
        } catch (e) {
          console.log('ContractAccessController.load ERROR:', e)
        }
      }
      this.contract = new this.web3.Contract(this.abi, this.contractAddress)
    }

    async canAppend(entry) {
      console.log(entry)
      if(!entry.payload.value.account){
        return 'Error, no account in entry'
      }
      const memberRequest = await this.contract.methods.members(entry.payload.value.account).call()
      if(memberRequest){
        console.log(memberRequest)
        // let isMember = memberRequest.exists
        return true
      }else{
        return false
      }
    }

    async grant (access, identity) {} // Logic for granting access to identity


    async save () {
      let cid
      try {
        cid = await io.write(this._ipfs, 'dag-cbor', {
          contractAddress: this.address,
          abi: JSON.stringify(this.abi, null, 2)
        })
      } catch (e) {
        console.log('ContractAccessController.save ERROR:', e)
      }
      // return the manifest data
      return { address: cid }
    }

    static async create (orbitdb, options) {
      if (!options.contractAddress && !options.address) {
        throw new Error("No 'contractAddress' given in options")
      }
      if (!options.web3) {
        throw new Error("No 'web3' given in options")
      }
      if (!options.defaultAccount) {
        console.warn('WARNING: no defaultAccount set')
      }

      return new DaoHausController(
        orbitdb._ipfs,
        options.web3,
        options.contractAddress,
        options.defaultAccount
      )
    }

}

// receive a dao contract,
// check signature in entry
// validate address in contract
// perform entry

// access control:
//P2P
//---
// Owner user grants to user

// Add web3 context, get user address and send it in each entry
// Later that should be a signature that will be handled (and verifyied by the access control)
// access control should look at the contract members and only allow those to make entries!

// Contract based
// ---
// User can write if address in contract? => DAO!
// Raid Guild cohort season 1 DAO : 0x10E31C10FB4912BC408Ce6C585074bd8693F2158
// method: members(addres) >
// delegateKey(address) shares(uint256) loot(uint256) exists(bool) highestIndexYesVote(uint256) jailed(uint256)
// [
// (address) : 0x08b3931b2ae83113c711c92e1bb87989f1fab004
// (uint256) : 10
// (uint256) : 0
// (bool) : true
// (uint256) : 0
// (uint256) : 0
// ]
