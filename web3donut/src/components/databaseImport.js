import React, {useState} from "react";
import {addDatabase} from "../libs/databaseLib";
import {Button, Input, IconButton, HStack,VStack} from '@chakra-ui/react';
import {Search2Icon} from '@chakra-ui/icons';

function DatabaseImport(props) {
  const [open, setOpen] = useState(false);

  async function add(){
    let address = document.getElementById('addressInput').value;
    console.log(address)
    await addDatabase(address);
    console.log('added!')
    setOpen(false);
  }

  return (
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
}

export default DatabaseImport;
