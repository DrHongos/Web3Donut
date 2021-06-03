import React,{useState} from "react";
import './App.css';
import { actions, StateProvider } from './state'

import Systems from './components/systems';
import Donut from './components/donut';
import DatabaseForm from './components/databaseForm';


function App() {
  const [formModal, setFormModal]=useState(false);
  const initialState = {
    user: null,
    db: null,
    dbrequests:null,
    programs: [],
    entries: [],
    entriesReq:[],
    orbitdbStatus: 'Starting',
    ipfsStatus: 'Starting',
  }


  const reducer = (state, action) => {
    switch (action.type) {
      case actions.SYSTEMS.SET_ORBITDB:
        return {
          ...state,
          orbitdbStatus: action.orbitdbStatus
        }
      case actions.SYSTEMS.SET_IPFS:
        return {
          ...state,
          ipfsStatus: action.ipfsStatus
        }
      case actions.DB.SET_DB:
        return {
          ...state,
          db: action.db,
          entries: action.entries,
        }
      case actions.DBREQUESTS.SET_DBREQUESTS:
        return {
          ...state,
          dbrequests: action.db,
          entriesReq: action.entries,
        }
      default:
        return state
    }
  }

// ipfs-http-client for (Electron) desktop app?

// Errors and bugs:
// db.iterator({ limit: -1 }).collect() says its not a function when empty


  return (
    <StateProvider initialState={initialState} reducer={reducer}>
    <div className="App">
      <header className="App-header">
      <Systems />
      <button onClick={()=>setFormModal(!formModal)}>Form Modal</button>
      {formModal?
        <DatabaseForm
        />
        :null}
      <Donut
        searchBar = {true}
      />
      </header>
    </div>
    </StateProvider>
  );
}

export default App;
