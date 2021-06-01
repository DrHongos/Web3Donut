import IPFS from 'ipfs'
import Config from './config'
import OrbitDB from 'orbit-db'

// const OrbitDB = require('orbit-db')
// const IpfsClient = require('ipfs-http-client')

// OrbitDB instance
let orbitdb
let ipfsNode
// Databases
let programs

// Start IPFS
export const initIPFS = async () => {
  //control center style
  // ipfsNode = await IPFS.create(Config.ipfs) // add repo?
  // return ipfsNode;

//test with ipfs-http-client
  // const ipfsNode = await IpfsClient.create(Config.ipfs)
  // return ipfsNode

// medium post style https://medium.com/tallylab/pushing-the-limits-of-ipfs-and-orbitdb-c86c8512ef2f
 ipfsNode = await IPFS.create(Config.ipfs)
 return ipfsNode;

}

// Start OrbitDB
export const initOrbitDB = async (ipfs) => {
//Control center
  // orbitdb = await OrbitDB.createInstance(ipfs, {repo:'./orbitDB'}) // add different repo from ipfs or its conflict
// medium article
  orbitdb = await OrbitDB.createInstance(ipfs, {repo:'./orbitDB'})
  // window.globaldb = await window.orbitdb.log(ipfsId.publicKey);
  // await globaldb.load();

  return orbitdb
}

export const getAllDatabases = async () => {
  if (!programs && orbitdb) {
    // Load programs database
    programs = await orbitdb.feed('network.programs', {
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
      console.log(db)
      const result = db.iterator({ limit: -1 }).collect().map(e => e.payload.value)
      console.log(result.join('\n'))
    })
  }
  return db
}

export const addDatabase = async (address) => {
  const db = await orbitdb.open(address)
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
  console.log(ipfsId.publicKey)
}

export const getDagObject = async (cid) =>{
  // console.log('searching for cid: ',cid) // get doesnt work for objects? test cids!
  // let dataR = (await ipfsNode.dag.get(cid)).value //, {path:'/value', pin:true}
  // if(dataR){
  //   return JSON.stringify(dataR);
  // }
  // else{
  //   console.log('error! data is undefined')
  // }

  //from nfticket
  for await (const result of ipfsNode.cat(cid.toString())) {
    console.log(result)
    return result
  }
}

export const dagPreparation = async (data) =>{
  let cid = await ipfsNode.dag.put(data);
  return cid;
}

export const removeDatabase = async (hash) => {
  return programs.remove(hash)
}
