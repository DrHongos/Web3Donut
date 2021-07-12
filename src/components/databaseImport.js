<<<<<<< HEAD
import React, {useState} from 'react'
import { addDatabase } from '../libs/databaseLib'
=======
import React, {useState} from "react";
import {addDatabase} from "../libs/databaseLib";
import {Button, Input, IconButton, HStack,VStack} from '@chakra-ui/react';
import {Search2Icon} from '@chakra-ui/icons';
>>>>>>> chakra

function DatabaseImport() {
  const [open, setOpen] = useState(false)

<<<<<<< HEAD
  const add = async () => {
    const { value: address } = document.getElementById('addressInput')
    await addDatabase(address)
    console.log('Added!', address)
=======
  async function add(){
    let address = document.getElementById('addressInput').value;
    console.log(address)
    await addDatabase(address);
    console.log('added!')
>>>>>>> chakra
    setOpen(false);
  }

  return (
<<<<<<< HEAD
    <div>
      <hr className="solid"/>
      <button onClick={() => setOpen(open => !open)}>
        Import DB
      </button>
      {open && (
        <div>
          <input id='addressInput' placeholder='Address'></input>
          <button onClick={add}>Add DB</button>
        </div>
      )}
    </div>
  )
=======
      <VStack>
        <Button variant= 'outline' colorScheme='white' onClick={()=>setOpen(!open)}>Import DB</Button>
        {open?
          <HStack>
            <Input id='addressInput' placeholder='Address' w='80%'></Input>
            <IconButton
              icon={<Search2Icon />}
              colorScheme='white'
              onClick={()=>add()}>
            Add DB</IconButton>

          </HStack>
          :null}
      </VStack>

  );
>>>>>>> chakra
}

export default DatabaseImport;
