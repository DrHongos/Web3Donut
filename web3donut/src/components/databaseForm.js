import React, {useState, useEffect} from "react";
import {useStateValue, actions } from '../state';
import { getAllDatabases, getDB, dagPreparation, createDatabase, getDagObject, getPublicKey, getDagCid } from '../libs/databaseLib'; //getPublicKey
const protocolsData = require("../libs/eth-ecosystem");

function DatabaseForm(props) {
  const [appState, dispatch] = useStateValue()
  const [address, setAddress ] = useState("/orbitdb/zdpuAyFL4s5i1LTNUsP1e6nZhUcv2uGDoMQZTRgukD1DwkmDn/Web3Donut");
    //'/orbitdb/zdpuAx6mPVQVVrfwURN5aKiCunQwa3mpuyvSqK69AARNeABoZ/Web3Tools'); // i deployed a failed element (signature errors)
// when i f*ck up DB i have to open control center, generate one, then create the same one from the browser, now its replicated (it will say that is already created!)

  const [loading, setLoading] = React.useState(false)
  const [entries, setEntries] = useState();

  async function fetchDatabases () {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
    const programs = await getAllDatabases()
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
    console.log(programs)
    return programs
  }

  async function getDataB(){
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
    const programs =  await getDB(address);
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs})
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
    console.log(programs)
    return programs
  }

  function ipldExplorer(address) {
    let url = `https://explore.ipld.io/#/explore/${address}`
    if(url) window.open(url, '_blank').focus();
  }
  async function getDag(cid, path){
    setLoading(true)
    let data = await getDagObject(cid, path)
    console.log('DAG retrieved, value: ',data.value)
    setLoading(false)
  }

  const fetchDB = async (address) => {
    setLoading(true)
    const db = await getDB(address)
      //

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

      dispatch({ type: actions.DB.SET_DB, db, entries })
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDB(address)
  }, [dispatch, address, appState.programs])


  const addToDB = async () => {
    const db = appState.db
    let key = document.getElementById('key').value
    let value = document.getElementById('value').value
    let creator = await getPublicKey();
    let timestamp = new Date()
    let ipfsCid = await dagPreparation({user:creator ,key:key,value:value, timestamp:timestamp})
      // {key:'Web3Tools',value:protocolsData})

    if (db.type !== 'keyvalue') {
      throw new Error('This component can only handle Key-Value databases')
    }

    await db.set(key,ipfsCid.string) // if i send the complete CID, i got signature errors
    const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
    setEntries(entries)
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }


  async function desperation(){ //first it wont find my hardcoded db.. once runned this one.. all works good!
    let newDB = await createDatabase('Web3Donut','keyvalue','public')
    console.log('newDB',newDB)
  }

  async function shortCid(cid){
    return cid.slice(0,4)
  }

  return (
      <div>
        <p>Create instance</p>
        <button onClick={()=>{getDataB()}}>Retrieve database manually</button><br />
        {loading?<p>Loading.. (data not replicated! )</p>:null}
        <div>
          <ul>
          {appState?.entries?<div>{appState.entries.map(x=>
            {return <li key={x.payload.value.key}>From:<button onClick={()=>{console.log(appState.db.get(x.payload.value.key))}}>{x.payload.value.key}</button> to <button onClick={()=>getDag(x.payload.value.value)}>{x.payload?.value?.value? x.payload.value.value.slice(0,4) : 'loading'}...</button><button onClick={()=>ipldExplorer(x.payload.value.value)}>Explorer</button><button onClick={()=>getDagCid(x.payload.value.value)}>Children</button></li>})}
            </div>:null}
          </ul>
        </div>

        <div>
        change the DB to log<br />
        set in localstorage the preferred address of the DB<br />
        show updates and approve (setLocalStorage) or reject (ignore) updates<br />

        dag.put eth-ecosystem.. see what object brings..<br />

        Show DB retrieval (suspend for data retrieval) - get data from IPFS<br />

        Create a leaf/branch form to introduce elements<br />
        Set one as attr of the other<br />
        Retest ipfs.dag get (for link nodes) / cat (for objects )<br />

        <input id='key' placeholder='key'></input><br />
        <input id='value' placeholder='value'></input><br />
        <button onClick={()=>{addToDB()}}>input kv</button>
        </div>
{/*
  <button  onClick={()=>desperation()}>create new db</button>
          <button disabled onClick={()=>{getPublicKey()}}>get ipfs id publicKey</button><br />*/}
      </div>

  );
}

export default DatabaseForm;
