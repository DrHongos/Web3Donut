import React, {useState} from "react";
import { dagPreparation } from '../libs/databaseLib';
import ObjectCreator from './objectCreation';
import {Button, ButtonGroup, Input, VStack, Checkbox, IconButton} from '@chakra-ui/react';
import {AttachmentIcon} from '@chakra-ui/icons';

function DBTools(props) {
  const [wrap, setWrap] = useState(true);
  const[caseSelected, setCaseSelected] = useState();
  // converge all input functions! manage different databases and inputs
  async function createEntry(key, value){
    // if (event) event.preventDefault()
    // if (value.length === 0) return
    let db = props.db;
    if(!value){
      value = document.getElementById('value').value;
    }
    if(!key){
      key = document.getElementById('key').value
    }
    if (db.type === 'eventlog') {
      let valueW;
      if (wrap){
        let wrappedCid = await dagPreparation({value:value})
        valueW = wrappedCid.toString();
        console.log('wrappedCid', valueW)
      }else{
        valueW = value;
      }
      //  Metadata of the log
      let timestamp = new Date();
      let ipfsCid = await dagPreparation({value:valueW,  timestamp:timestamp})
      // console.log(ipfsCid.toString())
      await db.add({key:key,value:ipfsCid.string})
    }else if(db.type === 'keyvalue'){
      await db.set(key,{value:value})
    }else if(db.type === 'docstore'){
      await db.put({_id:key, value:value});
    }else if(db.type === 'counter'){
      let fl
      try{
        fl = parseFloat(value)
      }catch{
        console.log('Please insert a number!')
        return
      }
      await db.inc(fl);
    }
    else{
      throw new Error('There was an error!')
    }
    // const allEntries = await db.iterator({ limit: 5 }).collect().reverse(); // iterator doesnt work for everyone
    // props.setEntries(allEntries);
    console.log('Saved!')
    setCaseSelected()
  }


  async function wrapAndLog(obj){
    // const db = props.db
    let key = document.getElementById('key').value
    let cid = await dagPreparation(obj)
    console.log('cid obj',cid.toString())
    createEntry(key, cid.toString())
    return cid;
  }

  async function giveAccess(){
    const address = document.getElementById('accessAddress').value
    console.log('give access to ',address)
    try{
      await props.db.access.grant('_write', address) // grant access to database2
    }catch{
      return 'Error in giving the access'
    }
    console.log('Access granted!')
  }

  async function uploadFileDB(){
    const selectedFile = document.getElementById('fileInput').files[0];
    let obj
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    let reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onloadend = function () {
        console.log('Readed!', reader.readyState); // readyState will be 2
        if(extension === 'json'){
          obj = JSON.parse(reader.result);
        }else{
          obj = reader.result;
        }
        wrapAndLog(obj);
      };
    }

    function handleSelection(selection){
      if(selection === caseSelected){
        setCaseSelected()
      }else{
        setCaseSelected(selection)
      }
    }


    const Case = () => {

      switch (caseSelected) {
        case 'AddToDB':
        return (
          <VStack>
          {(props.db._type === 'keyvalue' || props.db._type === 'eventlog')?
            <div>
              <Input  id='key' placeholder='key'></Input><br />
              <Input  id='value' placeholder='value'></Input><br />
            </div>
          :null}
          {props.db._type === 'counter'?
            <Input id='value' type='number' placeholder='number' w='20%'></Input>
          :null}

          {props.db._type === 'docstore'?
            <div>
              <Input id='key' placeholder='id'></Input>
              <Input id='value' placeholder='value'></Input><br />
{/*
              <Input disabled id='query' placeholder='id(?)'></Input>
              <button disabled onClick={()=>console.log('TODO! (needs input)')}>query</button>
              */}
            </div>
          :null}

          <Button
            colorScheme="white" variant="outline"
            w='25%'
            onClick={()=>{createEntry()}}>Add!
          </Button>

          </VStack>
        );
        case 'UploadFile':
        return (
          <VStack>
            <Input id='key' placeholder='key'></Input>
            <IconButton
              onClick={()=>{document.getElementById('fileInput').click()}}
              icon={<AttachmentIcon />}
              variant='outline'
              aria-label = 'Add a file'
              colorScheme='white'>
            </IconButton>
            <Input
              hidden
              type="file"
              id="fileInput">
           </Input>

           {/*accept=".json"*/}
           <div>
            <Button variant='outline' colorScheme='white' onClick={()=>uploadFileDB()}>Upload!</Button>
          </div>
          </VStack>

        );
        case 'ObjectForm':
        return (
          <ObjectCreator
             createEntry = {createEntry}
             wrap = {wrap}
             setWrap = {setWrap}
          />

        );
        case 'GrantAccess':
        return (
          <VStack>
            <Input id='accessAddress' placeholder='orbit-db identity (User)'></Input>
            <Button
              onClick={()=>giveAccess()}
              variant='outline'
              aria-label = 'give access'
              colorScheme='white'>grant access!
            </Button>
         </VStack>
        );

        default:
        return null;
      }
    };


  return (
    <div>
      <ButtonGroup variant="outline" >
        <Button colorScheme="white" disabled={!props.canWrite} onClick={()=>handleSelection('AddToDB')}>Add to DB</Button>
        <Button colorScheme="white" disabled={!props.canWrite || props.db._type !== 'eventlog'} onClick={()=>handleSelection('UploadFile')}>Upload an object</Button>
        <Button colorScheme="white" disabled={!props.canWrite} onClick={()=>handleSelection('ObjectForm')}>Create an object</Button>
        <Button colorScheme="white" disabled={!props.canWrite} onClick={()=>handleSelection('GrantAccess')}>Give access</Button>
      </ButtonGroup>
      <VStack>
        <Case />
        {caseSelected && caseSelected !=='GrantAccess'?
          <Checkbox variant='outline' colorScheme='white' type='checkbox' value={wrap} isChecked={wrap} onChange={()=>setWrap(!wrap)}>Wrap value in a DAG</Checkbox>
          :null}
      </VStack>
    </div>
  );
}

export default DBTools;
