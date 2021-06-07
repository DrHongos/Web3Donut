import React, {useState} from "react";
import {useStateValue } from '../state';
import DBCard from './databaseCard';

// when i f*ck up DB i have to open control center, generate one, then create the same one from the browser, now its replicated (it will say that is already created!)
function DatabaseForm(props) {
  const [appState] = useStateValue();
  const [loading, setLoading] = useState(false);


  return (
      <div>

        {loading?
          <div><hr class="solid"></hr>
            <p>Loading.. (data not replicated!)</p>
          <hr class="solid"></hr></div>
          :null}

        <hr class="solid"></hr>

        {appState.db?
        <DBCard
          name = 'IPFS Object Tests'
          db = {appState.db}
          entries = {appState.entries}
          user = {appState.user}
          setLoading = {setLoading}
        />
        :null}
        {appState.dbDAGtest?
          <DBCard
          name = 'DAG Tests'
          db = {appState.dbDAGtest}
          entries = {appState.entriesDAGtest}
          user = {appState.user}
          setLoading = {setLoading}
          />
          :null}
        {appState.dbrequests?
        <DBCard
          name = 'Requests'
          db = {appState.dbrequests}
          entries = {appState.entriesReq}
          user = {appState.user}
          setLoading = {setLoading}
        />
        :null}
        {appState.dbTrash?
        <DBCard
          name = 'Trash'
          db = {appState.dbTrash}
          entries = {appState.entriesTrash}
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


{/*
  Model 1 : Data as an object, root CID update<br />
  test the DB to log (add functions)<br />
  Connect all DB (fetch last one synched)<br />
  get data from IPFS for the sunburst<br />

  DB retrieval (replicate every xxx seconds)<br />
  Add access control (give/revoke access functions)<br />

  Model 2 : Data as DAG, update all parents till root (finally root update)<br />
  Create a leaf/branch form to introduce elements<br />
  where does DAGs work better?<br />
  Retest ipfs.dag get (for link nodes) / cat (for objects )<br />
  */}
      </div>

  );
}

export default DatabaseForm;
