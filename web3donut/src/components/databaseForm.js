import React, { useState } from 'react'
import { useStateValue } from '../state'
import DBCard from './databaseCard'

function DatabaseForm() {
  const [appState] = useStateValue()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <div>
      {loading && (
        <div>
          <hr className="solid"/>
          <p>Loading… (data not replicated!)</p>
          <hr className="solid"/>
        </div>
      )}
      <hr className="solid"/>
      <button onClick={()=>setOpen(open => !open)}>
        Databases
      </button>
      <hr className="solid"/>
      <div>{open ? 'O' : 'N'}{console.info('AS', appState) ?? null}</div>
      {open && (
        <div>
          {appState.db && (
            <DBCard
              name="IPFS Object"
              db={appState.db}
              entries={appState.entries}
              user={appState.user}
              setLoading={setLoading}
            />
          )}
          {appState.dbDAGtest && (
            <DBCard
              name="IPFS DAG"
              db={appState.dbDAGtest}
              entries={appState.entriesDAGtest}
              user={appState.user}
              setLoading={setLoading}
            />
          )}
          {appState.dbGuide && (
            <DBCard
              name="Guide"
              db={appState.dbGuide}
              entries={appState.entriesGuide}
              user={appState.user}
              setLoading={setLoading}
            />
          )}
          {appState.dbUsers && (
            <DBCard
              name="kvTests"
              db={appState.dbUsers}
              entries={appState.entriesUsers}
              user={appState.user}
              setLoading={setLoading}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default DatabaseForm
