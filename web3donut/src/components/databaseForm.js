import React, {useState} from "react";
import {useStateValue } from '../state';
import DBCard from './databaseCard';

function DatabaseForm(props) {
  const [appState] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  return (
      <div>
        {loading?
          <div><hr class="solid"></hr>
            <p>Loading.. (data not replicated!)</p>
          <hr class="solid"></hr></div>
          :null}
          <hr class="solid"></hr>
          <button  onClick={()=>setOpen(!open)}>Databases</button>

        <hr class="solid"></hr>
        {open?
          <div>
        {appState.db?
        <DBCard
          name = 'IPFS Object'
          db = {appState.db}
          entries = {appState.entries}
          user = {appState.user}
          setLoading = {setLoading}
        />
        :null}
        {appState.dbDAGtest?
          <DBCard
          name = 'IPFS DAG '
          db = {appState.dbDAGtest}
          entries = {appState.entriesDAGtest}
          user = {appState.user}
          setLoading = {setLoading}
          />
          :null}
        {appState.dbGuide?
        <DBCard
          name = 'Guide'
          db = {appState.dbGuide}
          entries = {appState.entriesGuide}
          user = {appState.user}
          setLoading = {setLoading}
        />
        :null}
        {appState.dbUsers?
        <DBCard
          name = 'kvTests'
          db = {appState.dbUsers}
          entries = {appState.entriesUsers}
          user = {appState.user}
          setLoading = {setLoading}
        />
        :null}
        </div>
        :null}
      </div>

  );
}

export default DatabaseForm;
