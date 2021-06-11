import React,{useState} from "react";
import './App.css';
import { actions, StateProvider, loadingState  } from './state'

import Systems from './components/systems';
import Filters from './components/filters';
import DatabaseForm from './components/databaseForm';
import DatabaseLocal from './components/databaseLocal';

function App() {
  const [guide, setGuide]=useState(true);
  const initialState = {
    user: null,
    db: null,
    entries: [],
    dbGuide:null,
    entriesGuide:[],
    dbDAGtest:null,
    entriesDAGtest:[],
    dbUsers:null,
    entriesUsers:[],
    programs: [],
    orbitdbStatus: 'Starting',
    ipfsStatus: 'Starting',
    program: false,
    loading: {
      programs: false
    }
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
      case actions.DBGUIDE.SET_DBGUIDE:
        return {
          ...state,
          dbGuide: action.db,
          entriesGuide: action.entries,
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
      case actions.PROGRAMS.SET_PROGRAM:
        return {
          ...state,
          program: action.program
        }
      case actions.PROGRAMS.SET_PROGRAM_LOADING:
        return {
          ...state,
          program: loadingState
        }
      case actions.PROGRAMS.SET_PROGRAMS:
        return {
          ...state,
          programs: action.programs
        }
      case actions.PROGRAMS.SET_PROGRAMS_LOADING:
        return {
          ...state,
          loading: { ...state.loading, programs: action.loading }
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
      <DatabaseForm />
      <DatabaseLocal />
      <Filters />
      </header>
      <ul>
        <li>Add DB of guide, which is a follow up (with alerts? or toasts?) of different parts of the app</li>
        <li>with information taken from the database IPNS blogging style</li>
        <li>convert ipfsObject into a Search tool to find objects in specific DB (key: 'orbitdb' - value: orbitdb object CID to add in a classificator)</li>
        <li>Create your classifications with name/object (as many as needed) into a DAG tree</li>
        <li><a href="https://github.com/orbitdb/orbit-db-access-controllers" target='blank' rel='noopener noreferrer'>access control</a></li>
      </ul>
    </div>
    </StateProvider>
  );
}

export default App;
