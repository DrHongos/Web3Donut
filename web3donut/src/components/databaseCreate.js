import React, {useState} from "react";
import {createDatabase, getAllDatabases} from "../libs/databaseLib";
import {Button, Input,VStack, Select} from '@chakra-ui/react';
// import {Search2Icon} from '@chakra-ui/icons';


function DatabaseCreate(props) {
  const [createDB, setCreateDB] = useState(false);

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
                </Select>
                <Button variant='outline' colorScheme='white' w='40%' onClick={()=>{createNewDB()}}>create!</Button>
              </VStack>
              :null}

      </VStack>

  );
}

export default DatabaseCreate;
