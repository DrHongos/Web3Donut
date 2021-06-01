import React from 'react'
import { initIPFS, initOrbitDB, getAllDatabases } from '../libs/databaseLib'
import { actions, useStateValue } from '../state'

function Systems () {
  const [appState, dispatch] = useStateValue()

  React.useEffect(() => {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })

    initIPFS().then(async (ipfs) => {
      dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started'})

      initOrbitDB(ipfs).then(async (databases) => {
        dispatch({ type: actions.SYSTEMS.SET_ORBITDB, orbitdbStatus: 'Started' })

        const programs = await getAllDatabases()
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
      })
    })
  }, [dispatch])

  return (
    <div>
          <div>
            <span>IPFS - </span>
            {appState.ipfsStatus === 'Started'
              ? <span>Connected</span>
              : <span>Not</span>
            }
          </div>
          <div>
            <span>OrbitDB - </span>
            {appState.orbitdbStatus === 'Started'
              ? <span>Connected</span>
              : <span>Not</span>
            }
          </div>
    </div>
  )
}

export default Systems
