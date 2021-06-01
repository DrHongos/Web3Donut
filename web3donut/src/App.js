import React,{useState} from "react";
import './App.css';
import { actions, loadingState, StateProvider } from './state'

import Systems from './components/systems';
import Donut from './components/donut';
import DatabaseForm from './components/databaseForm';


function App() {
  const [formModal, setFormModal]=useState(false);
  const initialState = {
    user: null,
    loginDialogOpen: false,
    createDBDialogOpen: false,
    addDBDialogOpen: false,
    programs: [],
    program: false,
    db: null,
    entries: [],
    orbitdbStatus: 'Starting',
    ipfsStatus: 'Starting',
    loading: {
      programs: false
    }
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
      case actions.DB.SET_DB:
        return {
          ...state,
          db: action.db,
          entries: action.entries,
        }
      case actions.DB.OPEN_CREATEDB_DIALOG:
        return {
          ...state,
          createDBDialogOpen: true
        }
      case actions.DB.CLOSE_CREATEDB_DIALOG:
        return {
          ...state,
          createDBDialogOpen: false
        }
      case actions.DB.OPEN_ADDDB_DIALOG:
        return {
          ...state,
          addDBDialogOpen: true
        }
      case actions.DB.CLOSE_ADDDB_DIALOG:
        return {
          ...state,
          addDBDialogOpen: false
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

// link orbitdb database of cid's (v1)
// add a new node, modify all the parents and introduce new CIDs on orbitdb
// for ipfs.dag structured data (node(cid) > name:XXX, children:cid, others..)
// each interaction will generate new cids (only required ones [newOne, lastClassifier, last-1Classifier,.., firstClassifier, Root])
// that will be updated on the database (and pinned, unpin old ones?)
// we request the latests synched database
// Add access control! (anyway everything is a log.. study deep!)
// ipfs-http-client for (Electron) desktop app?


// Errors and bugs:
// db.iterator({ limit: -1 }).collect() says its not a function when empty


  return (
    <StateProvider initialState={initialState} reducer={reducer}>
    <div className="App">
      <header className="App-header">
      <Systems />
      <button onClick={()=>setFormModal(!formModal)}>Form Modal</button>
      {formModal?<DatabaseForm />:null}
      <Donut
        searchBar = {true}
      />
      </header>
    </div>
    </StateProvider>
  );
}

export default App;
