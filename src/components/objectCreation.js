import React, {useState} from 'react'
import {
  Button, Input, VStack, Table, TableCaption, Box,
  Thead, Tbody, Th, Tr, Td, IconButton, Divider,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

const FieldsTable = (
  ({ fields, deleteItem, ...props }) => (
    <Table {...props}>
      <TableCaption placement="top">data</TableCaption>
      <Thead>
        <Tr>
          <Th>Key</Th>
          <Th>Value</Th>
          <Th>Functions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {fields.map(({ key, value }, idx) => (
          <Tr key={idx}>
            <Td>{key}</Td>
            <Td>{value}</Td>
            <Td>
              <IconButton
                colorScheme='white'
                icon={<DeleteIcon/>}
                onClick={() => deleteItem(key)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
)

const ObjectCreator = (props) => {
  const [fields, setFields] = useState([])

  const deleteItem = (e) => {
    let fieldsCurrent = [...fields]
    const index = fields.indexOf(
      fields.find((x) => x.key === e)
    )
    if (index > -1) {
      fieldsCurrent.splice(index, 1)
      setFields(fieldsCurrent)
      console.log('Removed', e)
    }
  }

  const nameProject = () => {
    const { value: name } = document.getElementById('name');
    const obj = { key: 'name', value: name }
    setFields((fields) => (
      [...fields, obj]
    ))
  }

  function addItem() {
    let { value: key } = document.getElementById('key');
    let { value } = document.getElementById('value');
    const obj = { key, value }
    setFields((fields) => (
      [...fields, obj]
    ))
    document.getElementById('key').value = '';
    document.getElementById('value').value = '';
  }

  async function createObject() {
    const result = Object.fromEntries(fields.map(k => [k["key"], k["value"]]))
    console.log(JSON.stringify(result))
    await props.createEntry(result['name'],JSON.stringify(result))
  }

  return (
    <Box>
      <hr className="solid"/>
      <Box>
        <Box>
          {fields.length > 0 ? (
            <Box>
              <FieldsTable {...{ fields, deleteItem }}/>
              <VStack>
                <Input
                  w='90%' colorScheme='white' variant='outline'
                  id='key' placeholder='Classificator'
                />
                <Input
                  w='90%' colorScheme='white' variant='outline'
                  id='value' placeholder='value'
                />
                <Button
                  colorScheme='white' variant='outline'
                  onClick={addItem}
                >
                  Add Property
                </Button>
                <Divider />
                <Button
                  colorScheme='white' variant='outline'
                  onClick={createObject}
                >
                  Finish Object
                </Button>
              </VStack>
              <Input
                type='checkbox' value={props.wrap} checked={props.wrap}
                onChange={() => props.setWrap(w => !w)}
              />
              Wrap value in a DAG
              <br/>
              <Button onClick={createObject}>Finish Object</Button>
            </Box>
          ) : (
            <Box>
              <VStack>
                <Input w='80%' variant='outline' colorScheme='white' id='name' placeholder='name'></Input>
                <Button variant='outline' colorScheme='white' onClick={()=>nameProject()}>Name the project</Button>
              </VStack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ObjectCreator;
