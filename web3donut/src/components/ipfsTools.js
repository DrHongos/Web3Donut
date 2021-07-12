import React, {useState} from "react";
import { dagPreparation, getFromIpfs, addIpfs, getIpfs, isCID } from '../libs/databaseLib';
import {Button, Center, Stack, Drawer, DrawerBody,DrawerHeader, DrawerOverlay, DrawerContent, Input, HStack,VStack, Divider, IconButton} from '@chakra-ui/react';
import CopyableText from './commons/copyableText';
import { useDisclosure } from "@chakra-ui/react";
import {AttachmentIcon} from '@chakra-ui/icons';

function IPFSTools(props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [result, setResult] = useState();
  const [caseSelected, setCaseSelected] = useState();

  async function SearchIPFS(){
    let cid = document.getElementById('getFile').value;
    let result = await getFromIpfs(cid);
    console.log(result)
    setResult(result);
  }

  async function getCidIPFS(){
    let cid = document.getElementById('getIpfs').value;
    let result = await getIpfs(cid);
    let decode;
    try{
      decode = new TextDecoder().decode(result)
    }catch{
      decode = result.toString()
    }
    console.log(decode)
    setResult(decode);
  }


  async function uploadDag(){
    let value = document.getElementById('dagData').value.toString();
    try{
      let cid = await dagPreparation(JSON.parse(value));
      setResult(cid.toString())
      console.log('Now is your responsability to make something cool!')
    }catch{
      console.log('Error in JSON.parse! please use a json format')
      setResult('Error in JSON.parse! please use a json format')
    }
  }

  async function addFileIpfs(){
    const selectedFile = document.getElementById('fileInput').files[0];
    let cid
    let reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onloadend = function () {
        cid = addIpfs(reader.result);
        setResult(cid.toString());
      };
    // if(results.length > 0){
    //   for await (const { cid } of results) {
    //     console.log(cid.toString())
    //   }
    //   return results;
    // }else{
    //   return 'There was a problem'
    // }
  }

  async function checkCID(){
    const cid = document.getElementById('isCID').value.toString();
    const is = await isCID(cid);
    setResult(is.toString())
  }



  // async function seeBookmarks(){
  //   const bookmarks = await browser.bookmarks.get()
  //   console.log(bookmarks)
  // }
  const Case = () => {

    switch (caseSelected) {
      case 'getFromIpfsModal':
      return (<HStack>
                <Input id='getIpfs' placeholder='Qm..' w='70%'></Input>
                <Button onClick={()=>{getCidIPFS()}}>ipfs.get(cid) </Button>
              </HStack>);
      case 'getFileIpfsModal':
      return (
        <HStack>
          <Input id='getFile' placeholder='Qm..' w='70%'></Input>
          <Button onClick={()=>{SearchIPFS()}}>ipfs.cat(cid)</Button>
        </HStack>
      )
      case 'createDag':
      return (
        <VStack>
          <Input id='dagData' placeholder='dag data'></Input>
          <Button onClick={()=>{uploadDag()}}>ipfs.dag.put(JSON.parse(data))</Button>
        </VStack>
      );
      case 'addIpfsModal':
      return (
        <HStack>
          <IconButton
            onClick={()=>{document.getElementById('fileInput').click()}}
            icon={<AttachmentIcon />}
            variant='outline'
            colorScheme='white'>
          </IconButton>
          <Input
            hidden
            type="file"
            id="fileInput">
         </Input>
          <Button onClick={()=>{addFileIpfs()}}>ipfs.add(file)</Button>
        </HStack>

      );
      case 'cidModal':
      return (
        <HStack>
          <Input id='isCID' placeholder='cid?' w='70%'></Input>
          <Button onClick={()=>{checkCID()}}>CID.isCID(cid)</Button>
        </HStack>
      );
      default:
      return null;
    }
  };

  return (
    <Center>
      <Button variant="outline" colorScheme="white" onClick={onOpen}>Other tool's</Button>

      <Drawer
        size='lg'
        placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg='gray'>
          <DrawerHeader borderBottomWidth="1px" color='lightgray'>IPFS Tools</DrawerHeader>
          <DrawerBody>

          {/* IPFS various */}
          <Stack
          variant="outline"
          spacing="2"
          >
          <Button onClick={()=>setCaseSelected('createDag')}>create DAG</Button>
          <Button onClick={()=>setCaseSelected('getFromIpfsModal')}>Get ipfs</Button>
          <Button onClick={()=>setCaseSelected('getFileIpfsModal')}>Get file</Button>
          <Button onClick={()=>setCaseSelected('addIpfsModal')}>Add file to ipfs</Button>
          <Button onClick={()=>setCaseSelected('cidModal')}>is CID?</Button>
          </Stack>
          <br />
          <Divider />
          <br />
          <Case />
          <br />
          <Divider />
          <br />
          {result?
            <CopyableText text={result} />
            :null}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </Center>
  );
}

export default IPFSTools;
