import React, {useState} from "react";
import {createDatabase, getAllDatabases} from "../libs/databaseLib";

function DatabaseCreate(props) {
  const [openCreate, setOpenCreate] = useState(false);
  const [createDB, setCreateDB] = useState(false);

  async function createNewDB(){
    let nameDB = document.getElementById('nameDB').value
    let type = document.getElementById('type').value
    let permissions = document.getElementById('permissions').value
    await createDatabase(nameDB,type,permissions).then((hash) => {
      console.log("Created", hash)
      getAllDatabases().then((data) => {
        console.log("Loaded programs", data)
        setOpenCreate(false);
      })
    })
  }

  return (
      <div>
          <button onClick={()=>setOpenCreate(!openCreate)}>Create DB</button>
          {openCreate?
            <div>
            <hr class="solid"></hr>
            <p>Create your Database</p>
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
