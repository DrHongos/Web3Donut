import React, {useState} from "react";
import {getAllDatabases} from "../libs/databaseLib";
import { useStateValue } from '../state'
// import DBCard from './databaseCard'; // not usable.. had to adapt!

function DatabaseLocal(props) {
  const [appState] = useStateValue();
  const [open, setOpen] = useState(false);

  async function refresh(){
    let allPrograms = await getAllDatabases()
    console.log(allPrograms)
  }


  return (
      <div>
          <button onClick={()=>setOpen(!open)}>My DB</button>
          {open?
            <div>
            <hr class="solid"></hr>
            My databases {'   '}
            <button onClick={()=>refresh()}>Refresh</button>
            <hr class="solid"></hr>
            {appState?.programs?.length > 0 ?
              <ul>
                {appState.programs.map(x => {return(
                  <li key={x.hash}>{x.payload.value.name}</li>
                )})}
              </ul>
            :'You dont have any yet. Create your first!'}
            </div>
          :null}
      </div>

  );
}

export default DatabaseLocal;
