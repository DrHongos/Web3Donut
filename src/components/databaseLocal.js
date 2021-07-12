import React, { useState, useEffect } from 'react'
import { getAllDatabases,  removeDatabase } from '../libs/databaseLib'
import { useStateValue } from '../state'
import EditModal from './editMode';
import DatabaseCreate from './databaseCreate';
import DatabaseImport from './databaseImport';
import { Table, TableCaption, Thead, Tbody, Tr,Th,Td, IconButton, HStack, VStack, Text} from "@chakra-ui/react";
// import DBCard from './databaseCard'; // not usable.. had to adapt!
import {DeleteIcon, EditIcon, TimeIcon, ArrowBackIcon } from '@chakra-ui/icons';
import '../App.css';


function DatabaseLocal(props) {
  const [appState] = useStateValue();
  const [items, setItems] = useState(appState.programs);
  const [editModal, setEditModal] = useState(false);

  async function refresh(){
    console.log('refreshed!')
    let allPrograms = await getAllDatabases()
    setItems(allPrograms)
  }
  useEffect(()=>{
    refresh()
  },[appState.programs,props.db])

  return (
        <VStack>
          <DatabaseCreate />
          <DatabaseImport />

          <HStack align='top'>
            {appState?.programs?.length !== 0 ?
              <div>
                {editModal?
                  <VStack>
                    <IconButton
                      colorScheme='white'
                      aria-label='Edit DB'
                      onClick={()=>setEditModal()}
                      icon={<ArrowBackIcon />}
                    >
                    </IconButton>
                    <EditModal
                    user = {appState.user}
                    address = {editModal}
                    />
                  </VStack>
                :
                <VStack>
                <HStack>
                  <Text color='white'>My databases</Text>
                  <IconButton
                  colorScheme='white'
                  icon={<TimeIcon />}
                  aria-label='Update DBs'
                  onClick={()=>refresh()}></IconButton>
                </HStack>

                <Table size='sm'> {/* Make it open/close so edit will close it and show each DB and add return button */}
                  <TableCaption>Local Databases</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>name</Th>
                      <Th>Type</Th>
                      <Th>Functions</Th>
                    </Tr>
                  </Thead>
                <Tbody>
                  {items.map(x => {return(
                  <Tr>
                   <Td>{x.payload.value.name}</Td>
                   <Td>{x.payload.value.type}</Td>
                   <Td>
                    <IconButton
                      colorScheme="white"
                      aria-label="Edit"
                      onClick={()=>setEditModal(x.payload.value.address)}
                      icon={<EditIcon />}
                      >
                    </IconButton>
                    <IconButton
                      colorScheme="white"
                      aria-label="Delete"
                      onClick={()=>removeDatabase(x)}
                      icon={<DeleteIcon />}
                      > {/* use an alert or modal!*/}
                    </IconButton>
                    </Td>
                  </Tr>
                 )})}
               </Tbody>
             </Table>
             </VStack>
            }
            </div>
            :'You dont have any yet. Create your first!'}

            </HStack>
      </VStack>
  );
}

export default DatabaseLocal
