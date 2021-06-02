import IPFS from 'ipfs'
import Config from './config'
import OrbitDB from 'orbit-db'
const CID = require('cids')

// const IpfsClient = require('ipfs-http-client') // for ipfs daemon cases??

// OrbitDB instance
let orbitdb
let ipfsNode
// Databases
// let programs //? will i use this?
//else
export const hardcodedDatabases = {
  dbData: '/orbitdb/zdpuAsrXXBwzeqLJ1hp7f6zhqPXesTDx1fzYBiegmJDmdkugV/Registry', //log
  counter: '/orbitdb/zdpuAzpyjbGpnzf1cZVf4dD45zCgMV6TopRxzs5yYtkFGbkn9/toolsCounter', //counter
  writeRequests: "/orbitdb/zdpuAwtDbBCfDK7sDpxZn7Jgzj9WxfPgS8STaxWadKtnmTwrk/access.manager", //keyvalue
}
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

// export const getAllDatabases = async () => {
//   if (!programs && orbitdb) {
//     // Load programs database
//     programs = await orbitdb.feed('network.programs', {
//       accessController: { write: [orbitdb.identity.id] },
//       create: true
//     })
//     await programs.load()
//   }
//   return programs
//     ? programs.iterator({ limit: -1 }).collect()
//     : []
// }

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

export const addDatabase = async (address) => { //searched
  const db = await orbitdb.open(address)
  return ({
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

  return ({
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

export const recreateCid = (cid) =>{
  const properCid = new CID(cid);// cid should be a correct object, NOT cid.toString()!!
  return properCid;
}

export const getDagCid = async (cid, path) =>{
  let properCid = recreateCid(cid)
  let dataR = (await ipfsNode.dag.get(properCid, {path}))
  if(dataR){
      let res = dataR //JSON.stringify()
      console.log(res)
      return res;
    }
    else{
        console.log('error! data is undefined')
      }

}

export const getDagObject = async (cid) =>{
// difference between cat and get?? study deep!!
  for await (const result of ipfsNode.cat(cid.toString())) {
    // console.log(result)
    return result
  }
}

export const dagPreparation = async (data) =>{
  // in put {pin:true}
  let cid = await ipfsNode.dag.put(data);
  return cid;
}

export const addToBlock = async (data) =>{
  let cid = await ipfsNode.add(data);
  console.log(cid)
  return cid.cid;
}

export const getTreeIpfs = async (cid, path) =>{
  let properCid = recreateCid(cid)
  let tree = await ipfsNode.dag.tree(properCid, {path});
  for await (const item of tree) {
    console.log(item)
  }
  return tree;
}

export const getFromIpfs = async (cid) =>{
  const stream = ipfsNode.cat(cid)
  let data = ''
  for await (const chunk of stream) {
    // chunks of data are returned as a Buffer, convert it back to a string // it doesn't work!
    data += chunk.toString()
  }
  console.log(data)
}

// export const sendRequest = async (obj) =>{
//   let requestDB;
//   try{
//     requestDB = await getDB("/orbitdb/zdpuAwtDbBCfDK7sDpxZn7Jgzj9WxfPgS8STaxWadKtnmTwrk/access.manager")
//   }catch{
//     console.log('There was an error!')
//   }
//   if(requestDB){
//     console.log('connected to requests database!')
//     requestDB.set('request',obj)
//   }else{
//     console.log('Database doesnt exists!')
//   }
//   return requestDB;
// }

export const removeDatabase = async (hash) => {
  console.log('Unpin DB!')
  return (hash)
}
