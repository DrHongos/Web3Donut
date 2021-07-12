import React, { useState, useEffect } from 'react'
import { getAllDatabases,  removeDatabase } from '../libs/databaseLib'
import { useStateValue } from '../state'
import EditModal from './editMode'
import IPFSTools from './ipfsTools'
import DatabaseCreate from './databaseCreate'
import DatabaseImport from './databaseImport'
import burn from '../libs/icons/burn.png'
import edit from '../libs/icons/edit.png'
import '../App.css'

// import DBCard from './databaseCard'; // not usable.. had to adapt!

function DatabaseLocal(props) {
  const [appState] = useStateValue()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(appState.programs)
  const [editModal, setEditModal] = useState(false)

  const refresh = async () => {
    setItems(await getAllDatabases())
  }

  useEffect(() => {
    refresh()
  }, [open, appState.programs, props.db])

  return (
    <div>
      <button onClick={()=>setOpen(open => !open)}>My DB</button>
      {open && (
        <div>
          <hr className="solid"/>
          <span>My Databases: </span>
          <button onClick={refresh}>Refresh</button>
          <br/>
          <DatabaseCreate/>
          <DatabaseImport/>
          <hr className="solid"/> {/*Have to difference counter DB's.*/}
          {appState.programs?.length === 0 ? (
            'You dont have any yet. Create your first!'
          ) : (
            <div>
              <table>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Functions</th>
                  {/* Add views for entries */}
                </tr>
                {items.map((item) => {
                  const { payload: { value: payload }} = item
                  return (
                    <tr>
                      <td>{payload.name}</td>
                      <td>{payload.type}</td>
                      <td>
                        <button onClick={() => setEditModal(payload.address)}>
                          <img src={edit} alt="Open &amp; Edit" width={20} height={23}/>
                        </button>
                        <button onClick={()=>removeDatabase(item.hash)}>
                          <img src={burn} alt='Delete' width={20} height={23}/>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </table>
              {editModal && (
                <div>
                  <EditModal
                    user={appState.user}
                    address={editModal}
                  />
                  <IPFSTools />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DatabaseLocal
