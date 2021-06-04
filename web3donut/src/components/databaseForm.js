import React, {useState} from "react";
import {useStateValue, actions } from '../state';
import DBCard from './databaseCard';

import { dagPreparation, createDatabase, getDagObject, getPublicKey, getDagCid, getFromIpfs, getTreeIpfs } from '../libs/databaseLib';
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
  const [uploadJson, setUploadJson] = useState(false);
  const [loading, setLoading] = React.useState(false);

  // async function addIpfs(data){
  //   let results = await addToBlock(data);
  //   for await (const { cid } of results) {
  //     console.log(cid.toString())
  //   }
  //   return results;
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
    console.log('new database ',nameDB,' created in ',newDB.address)
  }

  async function getFromIPFS(){
    let cid = document.getElementById('getCid').value;
    let result = await getFromIpfs(cid);
    return result;
  }

  async function createLog(value, db){
    // Create log has to manage multiple db's!
    if(!db){
      db = appState.dbTrash
    }

    // this to manage the add log button.. data is also introduced in args
    if(!value){
      value = document.getElementById('logValue').value;
    }

//  Metadata of the log
    let creator = await getPublicKey();
    let timestamp = new Date();
// Creates the ipfs block (is it a block?)
    let ipfsCid = await dagPreparation({value:value, creator: creator, timestamp:timestamp})
// catch error in input for eventlogs (remember CRUD functions are different)
    if (db.type === 'eventlog') {
      await db.add({value:ipfsCid.string})
    }else if(db.type === 'keyvalue'){
      await db.set('msg',{value:value, creator:creator})
    }
    else{
      throw new Error('This component can only handle eventlogs!')
    }
    // const entries = await db.iterator({ limit: 5 }).collect().reverse()
    // and then dispatch specific call
      // dispatch({ type: actions.DB.SET_DB, db, entries })
      // dispatch({ type: actions.DBTRASH.SET_DBTRASH, db, entries })
    console.log('Saved!')
  }

  async function uploadDag(){
    let value = document.getElementById('dagData').value;
    let cid = await dagPreparation(value);
    console.log(cid.toString())
    return cid;
  }


  async function wrapAndLog(obj, db){ // wrap and return..
    if(!db){
      db = appState.db
    }
    let cid = await dagPreparation(obj)
    console.log('cid obj',cid.toString())
    return cid;
  }

  async function uploadJsonDB(){
    const selectedFile = document.getElementById('jsonInput').files[0];
    let obj
    let cid
    let reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onloadend = function () {
        console.log('Readed!', reader.readyState); // readyState will be 2
        obj = JSON.parse(reader.result);
        cid = wrapAndLog(obj);
        createLog(cid.toString(), appState.db) // add db as arg
      };
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

        <DBCard
          name = 'Logs'
          db = {appState.db}
          entries = {appState.entries}
        />

        <DBCard
          name = 'Requests'
          db = {appState.dbrequests}
          entries = {appState.entriesReq}
        />

        <DBCard
          name = 'DAG Tests'
          db = {appState.dbDAGtest}
          entries = {appState.entriesDAGtest}
        />

        <DBCard
          name = 'Trash'
          db = {appState.dbTrash}
          entries = {appState.entriesTrash}
        />


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
            <p> Can i? public/access control</p>
            </div>
          :null}
          <button onClick={()=>setCreateDag(!createDag)}>simple DAG</button>
          {createDag?
            <div>
            <input id='dagData' placeholder='dag data'></input><br />
            <button onClick={()=>{uploadDag()}}>Add to dag</button><br />
            </div>
          :null}
          <button disabled={appState.entriesReq.length === 0} onClick={()=>setRequestPermission(!requestPermission)}>request permissions</button>
          {requestPermission?
            <div>
            <input id='requestName' placeholder='name'></input><br />
            <input id='requestMsg' placeholder='msg'></input><br />
            <button onClick={()=>{requestWritePermission()}}>Send!</button><br />
            </div>
          :null}
          <button onClick={()=>setUploadJson(!uploadJson)}>Add a new DB object (JSON)</button>
          {uploadJson?
              <div>
                <input type="file"
                  id="jsonInput"
                  accept=".json">
               </input>
               <div>
                <button onClick={()=>uploadJsonDB()}>Upload!</button>
              </div>
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
