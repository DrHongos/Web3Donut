import React from 'react'
import {  Button, Wrap,WrapItem, Spacer, HStack } from "@chakra-ui/react"
import {useHistory} from 'react-router-dom';
import Systems from './systems';
import {useStateValue } from '../state';
import IPFSTools from './ipfsTools';

function Header () {
  // const [] // selected route?
  const history = useHistory();
  const [appState] = useStateValue();
  // const [guide, setGuide]=useState(true);
  function handleShared(){
    history.push('sharedDatabases');
  }
  function handleLocal(){
    history.push('/localDatabases');
  }
  function handleVis(){
    history.push('/');
  }


  return (
    <HStack>
        <Systems />
        <Spacer />
        <Wrap>
          <WrapItem>
          <Button variant="outline" colorScheme="white" onClick={handleVis}>Visualization</Button>
          </WrapItem>
          <WrapItem>
          <Button
            colorScheme="white"
            variant="outline"
            onClick={handleShared}
            isDisabled={!appState.entries.length >0}
          >Shared Databases</Button>
          </WrapItem>
          <WrapItem>
          <Button
            variant="outline"
            colorScheme="white"
            onClick={handleLocal}
            isDisabled={!appState.entriesDAGtest.length >0}
          >Local Databases</Button>
          </WrapItem>
          <WrapItem>
            <IPFSTools />
          </WrapItem>
      </Wrap>
    </HStack>
  )
}

export default Header
