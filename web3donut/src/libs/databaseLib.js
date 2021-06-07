import IPFS from 'ipfs'
import Config from './config'
import OrbitDB from 'orbit-db'
const CID = require('cids')

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
  orbitdb = await OrbitDB.createInstance(ipfs, {repo:'./orbitDB'})
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

export const addDatabase = async (address) => {
  console.log(address)
  const db = await getDB(address)
  console.log(db)
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
  for await (const result of ipfsNode.cat(cid.toString())) {
    return result
  }
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
