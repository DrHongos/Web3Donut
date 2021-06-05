import React,{useState} from "react";
import './App.css';
import { actions, StateProvider } from './state'

import Systems from './components/systems';
import Filters from './components/filters';
import DatabaseForm from './components/databaseForm';


function App() {
  const [formModal, setFormModal]=useState(false);
  const initialState = {
    user: null,
    db: null,
    entries: [],
    dbrequests:null,
    entriesReq:[],
    dbTrash:null,
    entriesTrash:[],
    dbDAGtest:null,
    entriesDAGtest:[],
    dbUsers:null,
    entriesUsers:[],
    programs: [],
    orbitdbStatus: 'Starting',
    ipfsStatus: 'Starting',
  }


  const reducer = (state, action) => {
    switch (action.type) {
      case actions.USER.SET_USER:
        return {
          ...state,
          user: action.publicKey
        }

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
      case actions.DBTRASH.SET_DBTRASH:
        return {
          ...state,
          dbTrash: action.db,
          entriesTrash: action.entries,
        }
      case actions.DBDAGTEST.SET_DBDAGTEST:
        return {
          ...state,
          dbDAGtest: action.db,
          entriesDAGtest: action.entries,
        }
      case actions.DBUSERS.SET_DBUSERS:
        return {
          ...state,
          dbUsers: action.db,
          entriesUsers: action.entries,
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
      <button  onClick={()=>setFormModal(!formModal)}>Databases</button>
      {formModal?
        <DatabaseForm />
        :null}
      <Filters />
      </header>
    </div>
    </StateProvider>
  );
}

export default App;
