import React, {useState, useEffect} from "react";
import {getDB, ipldExplorer} from "../libs/databaseLib";
import DBTools from './databaseTools';
import CopyableText from './commons/copyableText';
import {Spinner, Center, Table, TableCaption, Thead, Tbody, Tr,Th,Td, IconButton, Text, Link, VStack } from '@chakra-ui/react'
import {Search2Icon} from '@chakra-ui/icons';
import '../App.css'

function EditModal(props) {
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState(null);
  const [entries, setEntries] = useState([]);
  const canWrite = (db) => {
    try{
      return db.access._write.includes(props.user) || db.access._write[0] ==='*'
    }catch{
      return true
    }
  };

  useEffect(async ()=>{ // eslint-disable-line react-hooks/exhaustive-deps
      setLoading(true);
      async function fetchDB(address){
        const db = await getDB(address)

        if (db) {
          let entry
          if (db.type === 'eventlog' || db.type === 'feed')
          entry = await db.iterator({ limit: 10 }).collect().reverse()
          else if (db.type === 'counter')
          entry = [{ payload: { value: db.value } }]
          else if (db.type === 'keyvalue')
          entry = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
          else if (db.type === 'docstore')
          entry = db.query(e => e !== null, {fullOp: true}).reverse()
          else
          entry = [{ payload: { value: "TODO" } }]

          setDb(db)
          setEntries([...entry])
          setLoading(false);
        }
      }
    fetchDB(props.address)
  },[props.address, setDb, setEntries])


  return (
      <Center>
      {db?
        <div>
        {loading? <Spinner />:
        <div>
        <DBTools
          db = {db}
          canWrite = {canWrite(db)}
          setEntries = {setEntries}
        />
        <CopyableText text={props.address} />
          {entries && entries.length > 0?
            <VStack>
            <Table size='sm'>
              <TableCaption placement='top' style={{color:'white', fontWeight:'bold'}}>
                <Text>Can i write: {canWrite(db)?'yes':'no'}</Text>
              </TableCaption>
              <Thead>
                <Tr>
                  {db._type === 'eventlog'?
                  <Th>functions</Th>
                  :null}
                  {db._type !== 'counter'?
                  <Th>key</Th>
                  :null}
                  <Th>value</Th>
                </Tr>
              </Thead>
              <Tbody>
            {entries.map((x, item)=>{return (
              <Tr key={item}>
              {db._type === 'eventlog'?
              <Td>
                <IconButton
                  colorScheme="white"
                  aria-label="Search entry"
                  onClick={()=>ipldExplorer(x.payload.value.value)}
                  icon={<Search2Icon />}
                />
              </Td>
              :null}
              {db._type !== 'counter'?
                <Td>
                  <p>{x.payload.value.key}</p>

                  {db._type === 'docstore'?
                  <p>{x.payload.value._id}</p>
                  :null}
                </Td>
                :null}

                {db._type === 'keyvalue'?
                  <Td>{x.payload.value.value.value?x.payload.value.value.value:x.payload.value.value}</Td>
                :null}
                {(db._type === 'eventlog' || db._type === 'docstore')?
                  <Td>{x.payload.value.value}</Td>
                :null}
                {db._type === 'counter'?
                  <Td>{x.payload.value}</Td>
                :null}
              </Tr>
            )})}
          </Tbody>
          </Table>
          </VStack>
          :
          <Center>
          <Text>no entries or DB not synched..  <Link href='https://www.youtube.com/watch?v=MkoeqtKUUe4' target='_blank' rel='noreferrer' style={{color:'white'}}>listen meanwhile</Link><
          /Text>
          </Center>}
        </div>
        }
      </div>
      :'There are no entries in this database, make the first!'}
    </Center>


  );
}
export default EditModal;
