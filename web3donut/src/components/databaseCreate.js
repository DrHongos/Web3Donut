<<<<<<< HEAD
import React, { useState } from 'react';
import {
  createDatabase, getAllDatabases,
} from "../libs/databaseLib";
=======
import React, {useState} from "react";
import {createDatabase, getAllDatabases} from "../libs/databaseLib";
import {Button, Input,VStack, Select} from '@chakra-ui/react';
// import {Search2Icon} from '@chakra-ui/icons';
import {useWeb3Context} from '../libs/Web3Context';
>>>>>>> chakra

function DatabaseCreate(props) {
  const [createDB, setCreateDB] = useState(false);
  const {provider} = useWeb3Context();

<<<<<<< HEAD
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
=======
  async function createNewDB(){
    let nameDB = document.getElementById('nameDB').value
    let type = document.getElementById('type').value
    let permissions = document.getElementById('permissions').value
    let extra = document.getElementById('extra').value
    await createDatabase(nameDB,type,permissions, provider, extra).then((hash) => {
      console.log("Created", hash)
      getAllDatabases().then((data) => {
        console.log("Loaded programs", data)
>>>>>>> chakra
      })
    )
  }

  return (
<<<<<<< HEAD
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
=======
      <VStack>
          <Button variant='outline' colorScheme='white' onClick={()=>setCreateDB(!createDB)}>Create DB</Button>
            {createDB?
              <VStack>
                <Input id='nameDB' placeholder='name'></Input>
                <Select id="type">
                  <option value="eventlog">EventLog</option>
                  <option value="keyvalue" selected>Key:Value</option>
                  <option value="docstore">Docstore</option>
                  <option value="counter">Counter</option>
                  </Select>
                <Select id="permissions">
                  <option value="public">Public</option>
                  <option value="" selected>Only me</option>
                  <option value="daoHaus" >DaoHaus control</option>
                  <option value="orbitdb" >Orbit DB identity</option>
                </Select>
                {createDB === 'dauHaus'?
                  <Input id='extra' placeholder='for options'></Input>
                :null}
                <Button variant='outline' colorScheme='white' w='40%' onClick={()=>{createNewDB()}}>create!</Button>
              </VStack>
              :null}

      </VStack>

  );
>>>>>>> chakra
}

export default DatabaseCreate;
