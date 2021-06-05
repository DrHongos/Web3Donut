import React, {useState} from "react";
import { dagPreparation } from '../libs/databaseLib';
import {  useStateValue } from '../state'; //actions,

function DBTools(props) {
  // const [open, setOpen] = useState(false);
  const [appState] = useStateValue();//, dispatch
  const [createKv, setCreateKv] = useState(false);
  const [createLogModal, setCreateLogModal] = useState(false);
  // const [requestPermission, setRequestPermission] = useState(false);
  const [uploadJson, setUploadJson] = useState(false);


  // converge all input functions! manage different databases and inputs

  async function createLog(value, db){
    // if (event) event.preventDefault()
    // if (value.length === 0) return
    // Create log has to manage multiple db's! and inputs..
    if(!db){
      db = appState.dbTrash
    }
    // this to manage the add log button.. data is also introduced in args
    if(!value){
      value = document.getElementById('logValue').value;
    }
//  Metadata of the log
    let timestamp = new Date(); // but not timing.. this goes by orbitdb
// Creates the ipfs block (is it a block?)
    let ipfsCid = await dagPreparation({value:value,  timestamp:timestamp}) //comment: comment,
// catch error in input for eventlogs (remember CRUD functions are different)
    if (db.type === 'eventlog') {
      await db.add({key:'db',value:ipfsCid.string})
    }else if(db.type === 'keyvalue'){
      await db.set('msg',{value:value})
    }
    else{
      throw new Error('This component can only handle eventlog/key-values!.. finish it!')
    }
    // const entries = await db.iterator({ limit: 5 }).collect().reverse()
    // and then dispatch specific call
      // dispatch({ type: actions.DB.SET_DB, db, entries })
      // dispatch({ type: actions.DBTRASH.SET_DBTRASH, db, entries })
    console.log('Saved!')
  }

  // async function requestWritePermission(){
  //   let db = appState.dbrequests;
  //   let name = document.getElementById('requestName').value;
  //   let msg = document.getElementById('requestMsg').value;
  //   let ids = appState.db.identity._id; // nope!!
  //   await db.set(name,{name:name, msg:msg, id:ids})
  //   const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
  //   dispatch({ type: actions.DBREQUESTS.SET_DBREQUESTS, db, entries })
  // }

  const addKv = async () => {
    const db = props.db
    let key = document.getElementById('key').value
    let value = document.getElementById('value').value
    // let timestamp = new Date();
    // let eventCid = await dagPreparation({creator: appState.user, timestamp:timestamp})
    // let ipfsCid = await dagPreparation({key:key,value:value, event:eventCid}) // all as a DAG?
    if (db.type !== 'keyvalue') {
      throw new Error('This component can only handle Key-Value databases')
    }
    await db.set(key,{value:value}) // if i send a complete CID, i got signature errors
    console.log('saved!')
    setCreateKv(false);
    // const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
    // dispatch({ type: actions.DB.SET_DB, db, entries }) // handle different actions
  }

  async function wrapAndLog(obj, db){ // wrap and return..
    if(!db){
      db = appState.db
    }
    let cid = await dagPreparation(obj)
    createLog(cid.toString(), props.db)
    console.log('cid obj',cid.toString())
    return cid;
  }

  async function uploadJsonDB(){
    const selectedFile = document.getElementById('jsonInput').files[0];
    let obj
    // let cid
    let reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onloadend = function () {
        console.log('Readed!', reader.readyState); // readyState will be 2
        obj = JSON.parse(reader.result);
        wrapAndLog(obj);
      };
    }

  return (
    <div>
{/* Adding/Edit content */}
      <button disabled onClick={()=>{props.db.del(props.db.all)}}>Delete kvstore</button>
      <button disabled={(!props.canWrite || props.db._type !== 'keyvalue')} onClick={()=>setCreateKv(!createKv)}>Add kv</button>
      <button disabled={!props.canWrite || props.db._type !== 'eventlog'} onClick={()=>setCreateLogModal(!createLogModal)}>Add log</button>
      <button disabled={!props.canWrite || props.db._type !== 'eventlog'} onClick={()=>setUploadJson(!uploadJson)}>Add a new DB object</button>
      {/*<button disabled={appState.entriesReq.length === 0} onClick={()=>setRequestPermission(!requestPermission)}>request permissions</button>*/}

      {createKv?
        <div>
          <input id='key' placeholder='key'></input><br />
          <input id='value' placeholder='value'></input><br />
          <button onClick={()=>{addKv()}}>create!</button>
        </div>
      :null}
      {createLogModal?
        <div>
          <input id='logValue' placeholder='new DB CID'></input><br />
          <button onClick={()=>{createLog()}}>make a log!</button>
        </div>
      :null}

      {/*requestPermission?
        <div>
          <input id='requestName' placeholder='name'></input><br />
          <input id='requestMsg' placeholder='msg'></input><br />
          <button onClick={()=>{requestWritePermission()}}>Send!</button><br />
        </div>
      :null*/}

      {uploadJson?
          <div>
            <p>Has to be a .json file!</p>
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
  );
}

export default DBTools;
