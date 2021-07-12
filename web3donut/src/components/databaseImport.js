import React, {useState} from 'react'
import { addDatabase } from '../libs/databaseLib'

function DatabaseImport() {
  const [open, setOpen] = useState(false)

  const add = async () => {
    const { value: address } = document.getElementById('addressInput')
    await addDatabase(address)
    console.log('Added!', address)
    setOpen(false);
  }

  return (
    <div>
      <hr className="solid"/>
      <button onClick={() => setOpen(open => !open)}>
        Import DB
      </button>
      {open && (
        <div>
          <input id='addressInput' placeholder='Address'></input>
          <button onClick={add}>Add DB</button>
        </div>
      )}
    </div>
  )
}

export default DatabaseImport;
