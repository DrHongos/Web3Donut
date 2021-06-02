import React, {useState} from "react";
import {useStateValue, actions } from '../state';
import { dagPreparation, createDatabase, getDagObject, getPublicKey, getDagCid, getFromIpfs, getTreeIpfs } from '../libs/databaseLib'; //getPublicKey
// const protocolsData = require("../libs/eth-ecosystem");

// when i f*ck up DB i have to open control center, generate one, then create the same one from the browser, now its replicated (it will say that is already created!)
function DatabaseForm(props) {
  const [appState, dispatch] = useStateValue();
  const [createLeaf, setCreateLeaf] = useState(false);
  const [createDB, setCreateDB] = useState(false);
  const [getFromIpfsModal, setGetFromIpfsModal] = useState(false);
  const [createLogModal, setCreateLogModal] = useState(false);
  const [createDag, setCreateDag] = useState(false);
  const [requestPermission, setRequestPermission] = useState(false);
  const [loading, setLoading] = React.useState(false)

  // async function addIpfs(data){
  //   let results = await addToBlock(data);
  //   for await (const { cid } of results) {
  //     console.log(cid.toString())
  //   }
  //   return results;
  // }

  // <button onClick={()=>{getDataB()}}>Retrieve database manually</button><br />
  // async function getDataB(){
  //   dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
  //   const programs =  await getDB(address);
  //   dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs})
  //   dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
  //   console.log(programs)
  //   return programs
  // }

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


  const addLeaf = async () => {
    const db = appState.db
    let name = document.getElementById('name').value
    let img = document.getElementById('img').value
    let url = document.getElementById('url').value
    let creator = await getPublicKey();
    let timestamp = new Date();
    // test of Cid inside Cid (DAG)
    let eventCid = await dagPreparation({creator: creator, timestamp:timestamp})
    let ipfsCid = await dagPreparation({name:name,img:img, url:url, event:eventCid})
      // {key:'Web3Tools',value:protocolsData}) - creates an object with object children (as is the hardcoded data)
    if (db.type !== 'keyvalue') {
      throw new Error('This component can only handle Key-Value databases')
    }
    await db.set(name,ipfsCid.string) // if i send the complete CID, i got signature errors
    const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }


  async function createNewDB(){ //first it wont find my hardcoded db.. once runned this one.. all works good!
    let nameDB = document.getElementById('nameDB').value
    let type = document.getElementById('type').value
    let permissions = document.getElementById('permissions').value
    let newDB = await createDatabase(nameDB,type,permissions)
    console.log('new database ',nameDB,' created in /orbitdb/',newDB,'/',nameDB)
  }

  async function getFromIPFS(){
    let cid = document.getElementById('getCid').value;
    let result = await getFromIpfs(cid);
    return result;
  }
  async function createLog(){
    const db = appState.db
    let value = document.getElementById('logValue').value;
    let creator = await getPublicKey();
    let timestamp = new Date();
    // test of Cid inside Cid (DAG)
    let eventCid = await dagPreparation({creator: creator, timestamp:timestamp})
    let ipfsCid = await dagPreparation({value:value, event:eventCid})

    if (db.type !== 'eventlog') {
      throw new Error('This component can only handle eventlogs!')
    }
    await db.add({value:ipfsCid.string})
    const entries = await db.iterator({ limit: 10 }).collect().reverse()
    dispatch({ type: actions.DB.SET_DB, db, entries })
    console.log('Saved!')
  }

  async function uploadDag(){
    let value = document.getElementById('dagData').value;
    let cid = await dagPreparation(value);
    console.log(cid.toString())
    return cid;
  }

  async function requestWritePermission(){
    let db = appState.dbrequests;
    let name = document.getElementById('requestName').value;
    let msg = document.getElementById('requestMsg').value;
    let ids = appState.db.identity._id;
      await db.set(name,{name:name, msg:msg, id:ids})
    const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
    dispatch({ type: actions.DBREQUESTS.SET_DBREQUESTS, db, entries })
  }

  return (
      <div>

        {loading?
          <div><hr class="solid"></hr>
            <p>Loading.. (data not replicated!)</p>
          <hr class="solid"></hr></div>
          :null}
        <div>
          <ul>
          {appState?.entries?
            <div>
            <hr class="solid"></hr>
            <h3>Logs</h3>
            {appState.entries.map(x=>
              {return (<li key={x.payload.value.value}>From:
              <button onClick={()=>{console.log(appState.db.get(x.payload.value.key))}}>{x.payload.value.key}</button>
               to
              <button onClick={()=>getDag(x.payload.value.value)}>{x.payload?.value?.value? x.payload.value.value.slice(0,4) : 'loading'}...</button>
              <button onClick={()=>ipldExplorer(x.payload.value.value)}>Explorer</button>
              <button onClick={()=>getDagCid(x.payload.value.value)}>get Dag Cid</button>
              <button onClick={()=>getTreeIpfs(x.payload.value.value)}>get Dag Tree</button>
              </li>)})}
            </div>
            :null}
          </ul>
        </div>

        <div>
          <ul>
          {appState?.entriesReq?
            <div>
            <hr class="solid"></hr>
            <h3>Requests</h3>
            {appState.entriesReq.map(x=>
              {return (<li key={x.payload.value.value.id}>From:
              {x.payload.value.value.id.slice(0,4)}..
               {' '}-{' '}
               {x.payload.value.value.name}{' '}-{' '}{x.payload.value.value.msg}{' '}
              <button onClick={()=>console.log('Authorize it!')}>Give access</button>
              </li>)})}
            </div>
            :null}
          </ul>
        </div>
        <hr class="solid"></hr>
        <div>
          <h3> Tool's</h3>
          {/*add input for the key to delete*/}
          <button disabled onClick={()=>{appState.dbrequests.del(appState.dbrequests.all)}}>Delete kvstore</button>
          <button disabled onClick={()=>setCreateLeaf(!createLeaf)}>Create leaf node</button>
          {createLeaf?
            <div>
            Where does the branch selection go?<br />
            Test of DAG cid's integration and resolution on root<br />
            <input id='name' placeholder='name'></input><br />
            <input id='img' placeholder='img'></input><br />
            <input id='url' placeholder='url'></input><br />
            <button onClick={()=>{addLeaf()}}>create!</button>
            </div>
          :null}
          <button disabled onClick={()=>setCreateDB(!createDB)}>Create DB</button>
          {createDB?
            <div>
            <input id='nameDB' placeholder='name'></input><br />
            <input id='type' placeholder='eventlog/keyvalue/docstore/counter'></input><br />
            <input id='permissions' placeholder='public/only me'></input><br />
            <button onClick={()=>{createNewDB()}}>create!</button>
            </div>
          :null}
          <button onClick={()=>setGetFromIpfsModal(!getFromIpfsModal)}>Get Block</button>
          {getFromIpfsModal?
            <div>
            <input id='getCid' placeholder='Qm..'></input><br />
            <button onClick={()=>{getFromIPFS()}}>get block!</button>
            </div>
          :null}
          <button onClick={()=>setCreateLogModal(!createLogModal)}>create log</button>
          {createLogModal?
            <div>
            <input id='logValue' placeholder='new DB CID'></input><br />
            <button onClick={()=>{createLog()}}>make a log!</button>
            </div>
          :null}
          <button onClick={()=>setCreateDag(!createDag)}>simple DAG</button>
          {createDag?
            <div>
            <input id='dagData' placeholder='dag data'></input><br />
            <button onClick={()=>{uploadDag()}}>Add to dag</button><br />
            </div>
          :null}
          <button onClick={()=>setRequestPermission(!requestPermission)}>request permissions</button>
          {requestPermission?
            <div>
            <input id='requestName' placeholder='name'></input><br />
            <input id='requestMsg' placeholder='msg'></input><br />
            <button onClick={()=>{requestWritePermission()}}>Send!</button><br />
            </div>
          :null}


        </div>
{/*
  Model 1 : Data as an object, root CID update<br />
  test the DB to log (add functions)<br />
  Connect all DB (fetch last one synched)<br />
  get data from IPFS for the sunburst<br />

  DB retrieval (replicate every xxx seconds)<br />
  Add access control (give/revoke access functions)<br />

  Model 2 : Data as DAG, update all parents till root (finally root update)<br />
  Create a leaf/branch form to introduce elements<br />
  where does DAGs work better?<br />
  Retest ipfs.dag get (for link nodes) / cat (for objects )<br />
  */}
      </div>

  );
}

export default DatabaseForm;
