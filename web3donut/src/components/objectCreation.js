import React, {useState} from "react";
import {Button, Input, VStack, Table, TableCaption, Thead, Tbody, Th, Tr, Td, IconButton,  Divider} from '@chakra-ui/react';
import {DeleteIcon } from '@chakra-ui/icons';


function ObjectCreator(props) {
  const [fields, setFields] = useState([]);

  function deleteItem(e){
    let fieldsCurrent = [...fields]
    const index = fields.indexOf(fields.find(x=>x.key === e));
    if (index > -1) {
      fieldsCurrent.splice(index, 1);
      setFields(fieldsCurrent)
      console.log("removing: ",e)
    }
  }

  function nameProject(){
    let name = document.getElementById('name').value;
    const obj = {key:'name', value:name}//[, {key:'key', value:name}] // test the key here
    setFields(prevState => (
      [...prevState, obj]
    ))
  }

  function addItem(){
    let key = document.getElementById('key').value;
    let value = document.getElementById('value').value;
    const obj = {key:key, value:value}
    setFields(prevState => (
      [...prevState, obj]
    ))
    document.getElementById('key').value = '';
    document.getElementById('value').value = '';
  }

  async function createObject(){
    const result = Object.fromEntries(fields.map(k => [k["key"], k["value"]]))
    console.log(JSON.stringify(result))
    await props.createEntry(result['name'],JSON.stringify(result))
    }

  return (
      <div>
        <div>
          {fields.length > 0?
            <div>
              <Table>
                <TableCaption placement='top'>data</TableCaption>
                <Thead>
                  <Tr>
                    <Th>key</Th>
                    <Th>value</Th>
                    <Th>functions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                {fields.map(x=>{return(
                  <Tr>
                    <Td>{x.key}</Td>
                    <Td>{x.value}</Td>
                    <Td><IconButton colorScheme='white' icon={<DeleteIcon />} onClick={()=>deleteItem(x.key)}></IconButton></Td>
                  </Tr>
                )})}
                </Tbody>
              </Table>
              <VStack>
                <Input w='90%' colorScheme='white' variant='outline' id='key' placeholder='Classificator'></Input>
                <Input w='90%' colorScheme='white' variant='outline' id='value' placeholder='value'></Input>
                <Button colorScheme='white' variant='outline' onClick={()=>addItem()}>Add property</Button>
                <Divider />
                <Button colorScheme='white' variant='outline' onClick={()=>createObject()}>Finish object</Button>
              </VStack>

            </div>
          :
          <div>
            <VStack >
              <Input w='80%' variant='outline' colorScheme='white' id='name' placeholder='name'></Input>
              <Button variant='outline' colorScheme='white' onClick={()=>nameProject()}>Name the project</Button>
            </VStack>
          </div>
        }


        </div>
      </div>

  );
}

export default ObjectCreator;
