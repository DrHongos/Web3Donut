import React, {useState} from "react";
import {createDatabase, getAllDatabases} from "../libs/databaseLib";
// import { useStateValue, actions } from '../state'

function DatabaseCreate(props) {
  // const [appState, dispatch] = useStateValue();
  const [openCreate, setOpenCreate] = useState(false);
  const [createDB, setCreateDB] = useState(false);
  // const [open, setOpen] = useState(false);

  async function createNewDB(){
    let nameDB = document.getElementById('nameDB').value
    let type = document.getElementById('type').value
    let permissions = document.getElementById('permissions').value
    await createDatabase(nameDB,type,permissions).then((hash) => {
      console.log("Created", hash)
      getAllDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    })
  }

  return (
      <div>
          <button onClick={()=>setOpenCreate(!openCreate)}>Create DB</button>
          {openCreate?
            <div>
            <hr class="solid"></hr>
            <h3>Create your Database</h3>
            <p>You create a DB for your DB's, its on your browser.. to improve security, copy its address wherever else</p>
            <p>Your user (signer) of the DB also could be deleted from browser.. for that we need to improve wiht <b>identity</b></p>
            <hr class="solid"></hr>
            {/*management*/}
            <button onClick={()=>setCreateDB(!createDB)}>Create new</button>
            {createDB?
              <div>
                <input id='nameDB' placeholder='name'></input><br />
                <select id="type">
                  <option value="eventlog">EventLog</option>
                  <option value="keyvalue" selected>Key:Value</option>
                  <option value="docstore">Docstore</option>
                  <option value="counter">Counter</option>
                </select>
                <select id="permissions">
                  <option value="public">Public</option>
                  <option value="" selected>Only me</option>
                </select>
                <button onClick={()=>{createNewDB()}}>create!</button>
              </div>
              :null}
              </div>
          :
          null
          }
      </div>

  );
}

export default DatabaseCreate;
