import React, {useState, useEffect} from "react";
import {useStateValue, actions } from '../state';
import { getAllDatabases, getDB, initIPFS, dagPreparation, createDatabase, getDagObject, getPublicKey } from '../libs/databaseLib'; //getPublicKey

function DatabaseForm(props) {
  const [appState, dispatch] = useStateValue()
  const [address, setAddress ] = useState('/orbitdb/zdpuAx6mPVQVVrfwURN5aKiCunQwa3mpuyvSqK69AARNeABoZ/Web3Tools');
    // ipfs public key'CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCY2C3UEcM13bgh4NyDnFQ8T/UQCdDYgAiT2XQa1Gz7kNG0vyvKDWfEJ5oTRp+9f9E75sfWoXvgPazsidhjGCtVgpXlRHwciUsuQ2N5hSZ20AN6fPEtj9yYPQANl8uSNbXU+XFibPMYsaOUJKWUNXZFvbrRPsn6p9OH252RldiaLcUFjUrm0UVgON2vT3QErhkyl0ITHs5NIC0TehT6PhbjIX6OhElboBFS1og9qWW41jlYi2D8I0QuVXogJX3Eh8eKqbU2yYXnMBpgoduQ3TAgwQtfjHQHwBTxDqgfRhMb2Gs2gbDnuPGvdiRvKQ3gvfFOM8bql8C661xxSZ2bDAp/AgMBAAE=');
    // "/orbitdb/zdpuAqZ1Ld97nQ2yq4aXBTvHjz3CyePofwpNwbLWM6Xsoz93Q/created");
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
  async function getDag(cid){
    setLoading(true)
    let data = await getDagObject(cid)
    console.log('DAG retrieved: ',data)
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
    // let creator = await getPublicKey(); ??
    let ipfsCid = await dagPreparation({key:key,value:value})

    if (db.type !== 'keyvalue') {
      throw new Error('This component can only handle Key-Value databases')
    }

    await db.set(key,ipfsCid.string)
    const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
    setEntries(entries)
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }


  async function desperation(){ //first it wont find my hardcoded db.. once runned this one.. all works good!
    let newDB = await createDatabase('created','keyvalue','public')
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
            {return <li key={x.payload.value.key}>From:<button onClick={()=>{console.log(appState.db.get(x.payload.value.key))}}>{x.payload.value.key}</button> to <button onClick={()=>getDag(x.payload.value.value)}>{x.payload?.value?.value? x.payload.value.value.slice(0,4) : 'loading'}...</button><button onClick={()=>ipldExplorer(x.payload.value.value)}>Explorer</button></li>})}
            </div>:null}
          </ul>
        </div>

        <div>
        <input id='key' placeholder='key'></input>
        <input id='value' placeholder='value'></input>
        <button onClick={()=>{addToDB()}}>input kv</button>
        </div>
        <button disabled onClick={()=>desperation()}>create new db</button>
{/*        <button disabled onClick={()=>{getPublicKey()}}>get ipfs id publicKey</button><br />*/}
      </div>

  );
}

export default DatabaseForm;
