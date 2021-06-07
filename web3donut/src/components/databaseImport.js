import React, {useState} from "react";
import {addDatabase} from "../libs/databaseLib";

function DatabaseImport(props) {
  const [open, setOpen] = useState(false);

  async function add(){
    let address = document.getElementById('addressInput').value;
    console.log(address)
    await addDatabase(address);
    console.log('added!')
    setOpen(false);
  }

  return (
      <div>
        <hr class="solid"></hr>
        <button onClick={()=>setOpen(!open)}>Import DB</button>
        {open?
          <div>
            <input id='addressInput' placeholder='Address'></input>
            <button onClick={()=>add()}>Add DB</button>

          </div>
          :null}
      </div>

  );
}

export default DatabaseImport;
