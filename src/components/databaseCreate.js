import React, { useState } from 'react'
import {
  createDatabase, getAllDatabases,
} from '../libs/databaseLib'
import {Button, Input,VStack, Select} from '@chakra-ui/react'
// import {Search2Icon} from '@chakra-ui/icons'
import {useWeb3Context} from '../libs/Web3Context'

const DatabaseCreate = (props) => {
  const [createDB, setCreateDB] = useState(false)
  const {provider} = useWeb3Context()

  const createNewDB = async () => {
    let nameDB = document.getElementById('nameDB').value
    let type = document.getElementById('type').value
    let permissions = document.getElementById('permissions').value
    let extra = document.getElementById('extra').value

    await (
      createDatabase(nameDB, type, permissions, provider, extra)
      .then((hash) => {
        console.log('Created', hash)
        getAllDatabases().then((data) => {
          console.log('Loaded programs', data)
        })
      })
    )
  }

  return (
    <VStack>
      <Button
        variant="outline" colorScheme="white"
        onClick={() => setCreateDB(c => !c)}
      >
        Create DB
      </Button>
      {createDB && (
        <VStack>
          <Input id="nameDB" placeholder="name"/>
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
          {createDB === 'dauHaus' && (
            <Input id="extra" placeholder="for options"/>
          )}
          <Button
            variant="outline" colorScheme="white" w="40%"
            onClick={createNewDB}
          >
            Create!
          </Button>
        </VStack>
      )}
    </VStack>
  )
}

export default DatabaseCreate
