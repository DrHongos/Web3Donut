import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'
import DaoHausController from './access_test'
import CID from 'cids'
import AccessControllers from 'orbit-db-access-controllers'
import CONFIG from './config'

AccessControllers.addAccessController({
  AccessController: DaoHausController
})

let orbitdb
let ipfsNode

let programs

export const initIPFS = async () => {
  if(!ipfsNode) {
    ipfsNode = await IPFS.create(CONFIG.ipfs)
  }
  return ipfsNode
}

export const initOrbitDB = async (ipfs) => {
  if(!orbitdb) {
    orbitdb = await (
      OrbitDB.createInstance(
        ipfs,
        {
          repo: './orbitDB',
          AccessControllers,
        }
      )
    )
  }
  console.log('orbit instance: ', orbitdb)
  return orbitdb
}

export const getAllDatabases = async () => {
  if(!programs && orbitdb) {
    programs = await orbitdb.feed('browser.programs', {
      accessController: { write: [orbitdb.identity.id] },
      create: true,
    })
    await programs.load()
  }
  return (
    programs ? (
      programs.iterator({ limit: -1 }).collect()
    ) : []
  )
}

export const getDB = async (address) => {
  let db
  if(orbitdb) {
    db = await orbitdb.open(address)
    await db.load()
    db.events.on('replicated', () => {
      console.log('replicated', db)
      const result = (
        db.iterator({ limit: -1 }).collect()
        .map(e => e.payload.value) // gives an error
      )
      console.table(result)
    })
  }
  return db
}

export function ipldExplorer(address) {
  let url = `https://explore.ipld.io/#/explore/${address}`
  if(url) window.open(url, '_blank').focus()
}

export const addDatabase = async (address) => {
  const { dbname, type } = await getDB(address)
  return programs.add({
    name: dbname,
    type,
    address,
    added: Date.now()
  })
}

export const createDatabase = async (name, type, permissions, provider, extra) => {
  let accessController
  let options
  switch (permissions) {
    case 'public':
      accessController = { write: ['*'] }
    break
    case 'daoHaus':
      options = {
        ipfs: ipfsNode, web3: provider,
        contractAddress: extra,
        accessController: { type: 'daohausmember' }
        //,defaultAccount: [orbitdb.identity.id]
      }
    break
    case 'orbitdb':
      accessController = {
        type:'orbitdb', write: [orbitdb.identity.id]
      }
    break
    default:
      accessController = { write: [orbitdb.identity.id] }
    break
  }

  let db
  if(options) {
    db = await orbitdb.create(name, type, { options })
  } else {
    db = await orbitdb.create(name, type, { accessController })
  }

  return programs.add({
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  })
}

export const removeDatabase = async (hash) => {
  console.log('Removing', hash)
  return programs.remove(hash)
}

export const getPublicKey = async () => (
  (await ipfsNode.id()).publicKey
)

const recreateCid = (cid) => (
  new CID(cid)
)

export const { isCID } = CID

export const getDagCid = async (cid, path) => {
  if(!isCID(cid)) {
    cid = recreateCid(cid)
  }
  let dataR = await ipfsNode.dag.get(cid, { path })
  if(dataR) {
    return dataR
  } else {
    console.log('Error! Data is undefined')
  }
}

export const getDagObject = async (cid) =>{
  // difference v1 and v0.. retrieve both obv..
  for await (const result of ipfsNode.cat(cid.toString())) {
    return result
  }
}

export const getV0 = async (cid) => ( //asyncgenerator
  await ipfsNode.get(cid)
)

export const getIpfs = getV0

export const dagPreparation = async (data) => (
  // in put {pin:true}
  await ipfsNode.dag.put(data)
)

export const addIpfs = async (data) => {
  const { cid } = await ipfsNode.add(data)
  console.log('Added', cid)
  return cid
}

export const getTreeIpfs = async (cid, path) => {
  if(!isCID(cid)){
    cid = recreateCid(cid)
  }
  const results = []
  const tree = await ipfsNode.dag.tree(cid, { path })
  for await (const item of tree) {
    results.push(item)
  }
  return results
}

export const getFromIpfs = async (cid) =>{
  const stream = ipfsNode.cat(cid)
  let data = ''
  for await (const chunk of stream) {
    // chunks of data are returned as a Buffer, convert it back to a string // it doesn't work!
    data += chunk.toString()
  }
  if(data !== '') {
    return data
  }
  return `Nothing was found in '${cid.toString()}'`
}
