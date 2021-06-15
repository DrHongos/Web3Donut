import React, {useState} from "react";
import DBTools from './databaseTools';
import CopyableText from './commons/copyableText';
import { HStack, Stat, StatLabel, StatHelpText, Center, IconButton, Select, Table, TableCaption, Thead,Tbody, Th,Tr,Td } from "@chakra-ui/react"
import {Search2Icon, ExternalLinkIcon } from '@chakra-ui/icons'

import {getDagCid, getDagObject, getTreeIpfs, ipldExplorer} from '../libs/databaseLib';
// import {fetchDB} from './systems';

function DBCard(props) {
  const [tip, setTip] = useState('');
  const [methodSelector, setMethodSelector] = useState();
  const canWrite = props.db.access._write.includes(props.user) || props.db.access._write[0] ==='*';
  const type = props.db._type

// continue debugging databaseTools for usage of DBs
  async function retrieve(type, cid, path){
      let mod = ''
      let text = ''
      let data
      switch (type){
        case 'get':
          data = props.db.get(cid)
          text = 'database get (db.get(key)) gives you: (check console)  '
          break
        case 'dag':
            data = await getDagCid(cid)
            text = 'ipfs.dag.get(cid, {path}) gives you: (check console) '
            break
        case 'dagCat':
            data = await getDagObject(cid)
            text = 'ipfs.cat(cid) gives you: (check console) '
            break
        case 'tree':
            data = await getTreeIpfs(cid)
            text = 'ipfs.dag.tree(cid, {path}) gives you: (check console) '
            break
        default:
          data = 'Error'
          text = 'Error'
          break

      }
      console.log(data)
      mod = (
        <div>
          <p> Tip: <br />{text}
        {/*  <p> {data.payload.value.value}</p>*/}
          </p>
        </div>
      )
      setTip(mod);
  }

  return (
    <Center>
      {props.db?
        <div>
        <Stat>
          <StatLabel><CopyableText text={props.db.id}/></StatLabel>
          <StatHelpText>type: {type}</StatHelpText>
          <StatHelpText>access: {props.db.access._write[0] ==='*' ? 'public' : props.db.access._write[0].slice(0,5)}..</StatHelpText>
          <StatHelpText>Can i write: {canWrite ? 'Yes!':'No!'}</StatHelpText>
        </Stat>

        <DBTools
          db = {props.db}
          canWrite = {canWrite}
        />

          {(props?.entries?.length > 0)?
            <Table variant="simple">
              <TableCaption>Latest {props.entries.length > 5 ? 5 : props.entries.length} events</TableCaption>
              <Thead>
                <Tr>
                  <Th>Key</Th>
                  <Th>Value</Th>
                  {type === 'eventlog'?
                  <Th>Functions</Th>
                  :null}
                </Tr>
              </Thead>
              <Tbody>
              {props.entries.map((x, item)=>
                {return (
                <Tr>
                  <Td>{x.payload.value.key}</Td>
                  {type === 'keyvalue'?
                  <Td>{x.payload.value.value.value}</Td>
                  :

                  <Td>{x.payload?.value?.value? x.payload.value.value.slice(0,4) : 'loading'}</Td>
                }
                {type==='eventlog'?
                <Td>
                <HStack>
                <IconButton
                colorScheme="white"
                aria-label="Search entry"
                icon={<ExternalLinkIcon />}
                onClick={()=>ipldExplorer(x.payload.value.value)}
                />
                {/*Select and button should be same component*/}
                <Select placeholder="Method" onChange={(e)=>setMethodSelector(e.target.value)} value={methodSelector}>
                <option value="dagCat">CAT</option>
                <option value="dag">DAG.GET</option>
                <option value="tree">Tree</option>
                </Select>

                <IconButton
                isDisabled={methodSelector===null}
                colorScheme="white"
                aria-label="Search entry"
                icon={<Search2Icon />}
                onClick={(e)=>retrieve(methodSelector, x.payload.value.value)}
                />
                </HStack>
                </Td>
                :null}
                </Tr>
              )})}
              </Tbody>
            </Table>

          :'Database empty, or not synched.. wait till replicates'}
          {tip !== ''? tip : null}
        </div>
        : null
      }
        <hr class="solid"></hr>

    </Center>

  );
}

export default DBCard;
