import IPFS from 'ipfs'
import Config from './config'
import OrbitDB from 'orbit-db'
import OtherAccessController from './access_test';
const CID = require('cids')
let AccessControllers = require('orbit-db-access-controllers')
AccessControllers.addAccessController({ AccessController: OtherAccessController })

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


// const IpfsClient = require('ipfs-http-client') // for ipfs daemon cases??

// OrbitDB instance
let orbitdb
let ipfsNode

// for personal DB's
let programs;
// Start IPFS
export const initIPFS = async () => {
//test with ipfs-http-client
  // const ipfsNode = await IpfsClient.create(Config.ipfs)
  // return ipfsNode

 ipfsNode = await IPFS.create(Config.ipfs)
 return ipfsNode;
}


// Start OrbitDB
export const initOrbitDB = async (ipfs) => {
// add different repo from ipfs or its conflict
  orbitdb = await OrbitDB.createInstance(ipfs, {repo:'./orbitDB', AccessControllers: AccessControllers})
  console.log('orbit instance: ', orbitdb)
  return orbitdb
}

export const getAllDatabases = async () => {
  if (!programs && orbitdb) {
    // Load programs database
    programs = await orbitdb.feed('browser.programs', {
      accessController: { write: [orbitdb.identity.id] },
      create: true
    })
    await programs.load()
  }
  return programs
    ? programs.iterator({ limit: -1 }).collect()
    : []
}

export const getDB = async (address) => {
  let db
  if (orbitdb) {
    db = await orbitdb.open(address)
    await db.load()
    db.events.on('replicated', () => {
      console.log('replicated',db)
      const result = db.iterator({ limit: -1 }).collect().map(e => e.payload.value) // gives an error
      console.log(result.join('\n'))
    })
  }
  return db
}

export function ipldExplorer(address) {
  let url = `https://explore.ipld.io/#/explore/${address}`
  if(url) window.open(url, '_blank').focus();
}

export const addDatabase = async (address) => {
  // console.log(address)
  const db = await getDB(address)
  // console.log(db)
  return programs.add({
    name: db.dbname,
    type: db.type,
    address: address,
    added: Date.now()
  })
}

export const createDatabase = async (name, type, permissions) => {
  let accessController

  switch (permissions) {
    case 'public':
      accessController = { write: ['*'] }
      break
    case 'access':
      accessController = {type:'othertype', write: [orbitdb.identity.id]}
      break
    case 'orbitdb':
      accessController = {type:'orbitdb', write: [orbitdb.identity.id]}
      break
    default:
      accessController = { write: [orbitdb.identity.id] }
      break
  }

  const db = await orbitdb.create(name, type, { accessController })

  return programs.add({
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  })
}


export const getPublicKey = async () =>{
  let ipfsId = await ipfsNode.id();
  return ipfsId.publicKey;
}

const recreateCid = (cid) =>{
  const properCid = new CID(cid);
  return properCid;
}

export const isCID = (cid) => {return CID.isCID(cid)};

export const getDagCid = async (cid, path) =>{
  if(!CID.isCID(cid)){
    let properCid = recreateCid(cid)
    cid = properCid
  }
  let dataR = (await ipfsNode.dag.get(cid, {path}))
  if(dataR){
      let res = dataR
      console.log(res)
      return res;
    }
    else{
        console.log('error! data is undefined')
      }
}

export const getDagObject = async (cid) =>{
  // difference v1 and v0.. retrieve both obv..
  for await (const result of ipfsNode.cat(cid.toString())) {
    return result
  }
}

export const getV0 = async (cid) =>{ //asyncgenerator
  let res = await ipfsNode.get(cid);
  return res;
}

export const getIpfs = async (cid) =>{
  let res = await ipfsNode.get(cid);
  return res;
}

export const dagPreparation = async (data) =>{
  // in put {pin:true}
  let cid = await ipfsNode.dag.put(data);
  return cid;
}

export const addIpfs = async (data) =>{
  let cid = await ipfsNode.add(data);
  console.log(cid)
  return cid.cid;
}

export const getTreeIpfs = async (cid, path) =>{
  if(!CID.isCID(cid)){
    let properCid = recreateCid(cid)
    cid = properCid
  }
  let results = []
  let tree = await ipfsNode.dag.tree(cid, {path});
  for await (const item of tree) {
    // console.log(item)
    results.push(item)
  }
  return results;
}

export const getFromIpfs = async (cid) =>{
  const stream = ipfsNode.cat(cid)
  let data = ''
  for await (const chunk of stream) {
    // chunks of data are returned as a Buffer, convert it back to a string // it doesn't work!
    data += chunk.toString()
  }
  if(data !== ''){
    return data;
  }else{
    return 'nothing was found in '+cid.toString()
  }

}
export const removeDatabase = async (hash) => {
  console.log(hash.hash)
  return programs.remove(hash.hash)
}
