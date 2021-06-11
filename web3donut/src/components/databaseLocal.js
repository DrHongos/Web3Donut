import React, {useState, useEffect} from "react";
import {getAllDatabases,  removeDatabase} from "../libs/databaseLib";
import { useStateValue } from '../state'
import EditModal from './editMode';
import IPFSTools from './ipfsTools';
import DatabaseCreate from './databaseCreate';
import DatabaseImport from './databaseImport';
import burn from '../libs/icons/burn.png';
import edit from '../libs/icons/edit.png';

// import DBCard from './databaseCard'; // not usable.. had to adapt!
import '../App.css';
function DatabaseLocal(props) {
  const [appState] = useStateValue();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(appState.programs);
  const [editModal, setEditModal] = useState(false);

  async function refresh(){
    let allPrograms = await getAllDatabases()
    setItems(allPrograms)
  }

  useEffect(()=>{
    refresh()
  },[open,appState.programs,props.db])

  return (
      <div>
          <button onClick={()=>setOpen(!open)}>My DB</button>
          {open?
            <div>
            <hr class="solid"></hr>
            My databases {'   '}
            <button onClick={()=>refresh()}>Refresh</button><br />
            <DatabaseCreate />
            <DatabaseImport />
            <hr class="solid"></hr> {/*Have to difference counter DB's.*/}
            {appState?.programs?.length !== 0 ?
              <div>
                <table>
                  <tr>
                    <th>name</th>
                    <th>Type</th>
                    <th>Functions</th>
                    {/* Add views for entries */}
                  </tr>
                  {items.map(x => {return(
                  <tr >
                   <td>{x.payload.value.name}</td>
                   <td>{x.payload.value.type}</td>
                   <td>
                    <button onClick={()=>setEditModal(x.payload.value.address)}><img src={edit} alt='open&edit' width="20" height="23"></img></button>
                    <button onClick={()=>removeDatabase(x)}><img src={burn} alt='delete' width="20" height="23"></img></button>
                    </td>
                  </tr>
                 )})}
                 </table>
                 {editModal?
                   <div>
                     <EditModal
                        user = {appState.user}
                        address = {editModal}
                     />
                     <IPFSTools />
                  </div>
                 :null}
              </div>
            :'You dont have any yet. Create your first!'}
            </div>
          :null}
      </div>

  );
}

export default DatabaseLocal;
