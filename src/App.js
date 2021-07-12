import React from "react"; //,{useState}
import './App.css';
import { actions, StateProvider, loadingState  } from './state'

import Header from './components/header';
import Filters from './components/filters';
import DatabaseForm from './components/databaseForm';
import DatabaseLocal from './components/databaseLocal';
import { ChakraProvider, Box } from '@chakra-ui/react/';
import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Web3ContextProvider from "./libs/Web3Context";


function App() {
  const initialState = {
    user: null,
    db: null,
    entries: [],
    dbGuide: null,
    entriesGuide: [],
    dbDAGtest: null,
    entriesDAGtest: [],
    dbUsers: null,
    entriesUsers: [],
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
    <ChakraProvider>
      <Web3ContextProvider>
        <Box
          backgroundColor='#303030'
          color='white'
        >
          <Router>
            <Header w='100%'/>
            <Switch>
              <Route exact path="/sharedDatabases" component={DatabaseForm} />
              <Route exact path="/localDatabases" component={DatabaseLocal} />
              <Route path="/" component={Filters} />
              <Redirect to="/" />
            </Switch>
          </Router>
        </Box>
      </Web3ContextProvider>
{/*
      <ul>
        <li>Add DB of guide, which is a follow up (with alerts? or toasts?) of different parts of the app</li>
        <li>with information taken from the database IPNS blogging style</li>
        <li>convert ipfsObject (key-value or doc?) into a Search tool to find objects in specific DB (key: 'orbitdb' - value: orbitdb object CID to add in a classificator)</li>
        <li><a href="https://github.com/orbitdb/orbit-db-access-controllers" target='blank' rel='noopener noreferrer'>access control</a></li>
        <li>Encryption and privacy - https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/README.md</li>
        <li>https://github.com/QuestNetwork/qd-messages-ts</li>
        <li>https://github.com/Peergos/Peergos</li>
      </ul>
*/}
    </ChakraProvider>
    </StateProvider>
  );
}

export default App
