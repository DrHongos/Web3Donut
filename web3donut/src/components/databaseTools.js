import React, {useState} from "react";
import { dagPreparation } from '../libs/databaseLib';
import {  useStateValue } from '../state'; //actions,

function DBTools(props) {
  const [open, setOpen] = useState(false);
  const [appState] = useStateValue();//, dispatch
  const [uploadJson, setUploadJson] = useState(false);

  // converge all input functions! manage different databases and inputs
  async function createEntry(value){
    // if (event) event.preventDefault()
    // if (value.length === 0) return
    let db = props.db;
    let key
    if(!value){
      value = document.getElementById('value').value;
    }
    try{
      key = document.getElementById('key').value
    }catch{
      key = 'dbEntry'
    }
    if (db.type === 'eventlog') {
      //  Metadata of the log
      let timestamp = new Date();
      let ipfsCid = await dagPreparation({value:value,  timestamp:timestamp})
      // console.log(ipfsCid.toString())
      await db.add({key:key,value:ipfsCid.string})
    }else if(db.type === 'keyvalue'){
      await db.set(key,{value:value})
    }else if(db.type === 'docstore'){
      await db.put({_id:key, value:value});
    }else if(db.type === 'counter'){
      let fl
      try{
        fl = parseFloat(value)
      }catch{
        console.log('Please insert a number!')
        return
      }
      await db.inc(fl);
    }
    else{
      throw new Error('There was an error!')
    }
    // const allEntries = await db.iterator({ limit: 5 }).collect().reverse(); // iterator doesnt work for everyone
    // props.setEntries(allEntries);
    console.log('Saved!')
    setOpen(false);
  }


  async function wrapAndLog(obj, db){
    if(!db){
      db = appState.db
    }
    let cid = await dagPreparation(obj)
    createEntry(cid.toString())
    console.log('cid obj',cid.toString())
    return cid;
  }

  async function uploadJsonDB(){
    const selectedFile = document.getElementById('jsonInput').files[0];
    let obj
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
      <button disabled={!props.canWrite} onClick={()=>setOpen(!open)}>Add to DB</button>
      <button disabled={!props.canWrite || props.db._type !== 'eventlog'} onClick={()=>setUploadJson(!uploadJson)}>Add a new DB object</button>

      {open?
        <div>
        {(props.db._type === 'keyvalue' || props.db._type === 'eventlog')?
          <div>
            <input id='key' placeholder='key'></input><br />
            <input id='value' placeholder='value'></input><br />
          </div>
        :null}
        {props.db._type === 'counter'?
          <input id='value' type='number' placeholder='number'></input>
        :null}

        {props.db._type === 'docstore'?
          <div>
          <input id='key' placeholder='id'></input>
          <input id='value' placeholder='value'></input>
          </div>
        :null}

        <button onClick={()=>{createEntry()}}>Add!</button>
        </div>
      :null}


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
