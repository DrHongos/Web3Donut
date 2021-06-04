import React, {useState} from 'react'
import { initIPFS, initOrbitDB,  getDB, getPublicKey } from '../libs/databaseLib'
import { actions, useStateValue } from '../state'

function Systems () {
  const [appState, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const fetchDB = async (address, type) => {
    setLoading(true)
    const db = await getDB(address)
    if (db) {
      let entries
      if (db.type === 'eventlog' || db.type === 'feed')
        entries = await db.iterator({ limit: 10 }).collect().reverse()
      else if (db.type === 'counter')
        entries = [{ payload: { value: db.value } }]
      else if (db.type === 'keyvalue')
        entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
      else if (db.type === 'docstore')
        entries = db.query(e => e !== null, {fullOp: true}).reverse()
      else
        entries = [{ payload: { value: "TODO" } }]
    switch (type) {
      case 'requests':
        dispatch({ type: actions.DBREQUESTS.SET_DBREQUESTS, db, entries })
        break;
      case 'DAGTest':
        dispatch({ type: actions.DBDAGTEST.SET_DBDAGTEST, db, entries })
        break;
      case 'trash':
        dispatch({ type: actions.DBTRASH.SET_DBTRASH, db, entries })
        break;
      default:
        dispatch({ type: actions.DB.SET_DB, db, entries })
        break;
    }
    // console.log('DB ',type,'retrieved!  ')
    setLoading(false)
    }else{
      console.log(address, ' couldnt be found')
    }
  }

  async function initDatabases(){
    await fetchDB('/orbitdb/zdpuArkzsrwpHS7ptLh4wq6YV2HfQEKSxPZGEmfNuWw8H8QYC/DBLOGS')
    await fetchDB('/orbitdb/zdpuApTdrZtdtUQ4xrqydQ1MgfcC41RGScm5wvCYPuWom6fJh/DAGTest.logs', 'DAGTest')
    await fetchDB("/orbitdb/zdpuAwtDbBCfDK7sDpxZn7Jgzj9WxfPgS8STaxWadKtnmTwrk/access.manager",'requests')
    await fetchDB('/orbitdb/zdpuB2HtaiTPDEqPidv5tv66s8SL8UAowGLXLpcKtm7AaHRF6/test.stuff', 'trash')
    }

  // useEffect(() => {
  //   fetchDB(address)
  // }, [dispatch, address]) //fetchDB as callback?

  React.useEffect(() => {

    initIPFS().then(async (ipfs) => {
      dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started'})

      initOrbitDB(ipfs).then(async (databases) => {
        dispatch({ type: actions.SYSTEMS.SET_ORBITDB, orbitdbStatus: 'Started' })

        let publicKey = await getPublicKey();
        dispatch({type: actions.USER.SET_USER, publicKey})
        await initDatabases()

      })
    })
  }, [dispatch])// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
          {loading?<h3>Loading..</h3>:null}
          <div>
            <span>IPFS - </span>
            {appState.ipfsStatus === 'Started'
              ? <span>Connected</span>
              : <span>Not</span>
            }
          </div>
          <div>
            <span>OrbitDB - </span>
            {appState.orbitdbStatus === 'Started'
              ? <span>Connected</span>
              : <span>Not</span>
            }
          </div>
          <div>
            <span>Databases - </span>
            {appState.db?
              <span>Connected</span>
              : <span>Not</span>
            }{' '}
            <button onClick={()=>initDatabases()}>Update</button>
          </div>
    </div>
  )
}

export default Systems
