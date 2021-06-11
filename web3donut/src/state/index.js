import React, { createContext, useReducer, useContext } from 'react'

export const StateContext = createContext()

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

export const useStateValue = () => useContext(StateContext)

export const actions = {
  USER: {
    SET_USER: 'SET_USER'
  },
  DB: {
    SET_DB: 'SET_DB'
  },
  DBGUIDE:{
    SET_DBGUIDE:'SET_DBGUIDE'
  },
  DBDAGTEST:{
    SET_DBDAGTEST:'SET_DBDAGTEST'
  },
  DBUSERS:{
    SET_DBUSERS:'SET_DBUSERS'
  },
  SYSTEMS: {
    SET_IPFS: 'SET_IPFS',
    SET_ORBITDB: 'SET_ORBITDB'
  },
  PROGRAMS: {
    SET_PROGRAMS: 'SET_PROGRAMS',
    SET_PROGRAMS_LOADING: 'SET_PROGRAMS_LOADING',
  }

}

export const loadingState = 'loading'
