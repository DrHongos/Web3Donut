import React, { createContext, useReducer, useContext } from 'react'

export const StateContext = createContext()

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

export const useStateValue = () => useContext(StateContext)

export const actions = {
  DB: {
    SET_DB: 'SET_DB'
  },
  DBREQUESTS:{
    SET_DBREQUESTS:'SET_DBREQUESTS'
  },
  SYSTEMS: {
    SET_IPFS: 'SET_IPFS',
    SET_ORBITDB: 'SET_ORBITDB'
  },
}

export const loadingState = 'loading'
