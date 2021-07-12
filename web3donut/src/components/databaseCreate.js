import React, { useState } from 'react';
import {
  createDatabase, getAllDatabases,
} from "../libs/databaseLib";

function DatabaseCreate(props) {
  const [openCreate, setOpenCreate] = useState(false);
  const [createDB, setCreateDB] = useState(false);

  async function createNewDB() {
    const { value: nameDB } = document.getElementById('nameDB')
    const { value: type } = document.getElementById('type')
    const { value: permissions } = (
      document.getElementById('permissions')
    )
    await (
      createDatabase(nameDB, type, permissions)
      .then((hash) => {
        console.log('Created', hash)
        getAllDatabases().then((data) => {
          console.log('Loaded Programs', data)
          setOpenCreate(false);
        })
      })
    )
  }

  return (
    <div>
      <button onClick={()=>setOpenCreate(open => !open)}>
        Create DB
      </button>
      {openCreate && (
        <div>
          <hr className="solid"/>
          <p>Create your Database</p>
          <button onClick={() => setCreateDB(create => !create)}>
            Create New
          </button>
          {createDB && (
            <div>
              <input id="nameDB" placeholder="name"/>
              <br/>
              <select id="type">
                <option value="eventlog">EventLog</option>
                <option value="keyvalue" selected>Key:Value</option>
                <option value="docstore">Docstore</option>
                <option value="counter">Counter</option>
              </select>
              <select id="permissions">
                <option value="public">Public</option>
                <option value="" selected>Only Me</option>
              </select>
              <button onClick={createNewDB}>Create!</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DatabaseCreate;
