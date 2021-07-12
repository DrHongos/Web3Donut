import React, {useState} from "react";
import {useStateValue } from '../state';
import DBCard from './databaseCard';
import { Spinner, Center, Select } from "@chakra-ui/react"

function DatabaseForm(props) {
  const [appState] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [showDatabase, setShowDatabase] = useState();
  const databasesData = [{name:'ipfsObject', db:appState.db, entries:appState.entries}
  ,{name:'ipfsDag',db:appState.dbDAGtest,entries:appState.entriesDAGtest},
  {name:'Guide',db:appState.dbGuide,entries:appState.entriesGuide},
  {name:'kvTests',db:appState.dbUsers,entries:appState.entriesUser}]

  const chosenDB = (name)=>{return databasesData.find(x=>x.name === name)}
  return (
      <Center>
        {loading?
          <div>
            <Spinner />
            <p>Loading.. (data not replicated!)</p>
          </div>
          :null}

          <div>
          <Select placeholder="Database" onChange={(e)=>setShowDatabase(e.target.value)}>
            <option value="ipfsObject" disabled={!appState.entries.length >0}>IPFS Object</option>
            <option disabled={!appState.entriesDAGtest.length >0} value="ipfsDag">IPFS DAG</option>
            <option disabled={!appState.entriesGuide.length >0} value="Guide">Guide</option>
            <option disabled={!appState.entriesUsers.length >0} value="kvTests">KvTests</option>
          </Select>

          {showDatabase?
            <DBCard
              name = {showDatabase}
              db = {chosenDB(showDatabase).db}
              entries = {chosenDB(showDatabase).entries}
              user = {appState.user}
              setLoading = {setLoading}
            />
            :null}

        </div>
      </Center>

  );
}

export default DatabaseForm
