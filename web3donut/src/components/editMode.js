import React, {useState, useEffect} from "react";
import {getDB} from "../libs/databaseLib";
import DBTools from './databaseTools';
import copy from '../libs/icons/copy.png';

import '../App.css'

function EditModal(props) {
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState(null);
  const [entries, setEntries] = useState([]);
  const canWrite = (db) =>{return db.access._write.includes(props.user) || db.access._write[0] ==='*'};

  useEffect(async ()=>{ // eslint-disable-line react-hooks/exhaustive-deps
      setLoading(true);
      async function fetchDB(address){
        const db = await getDB(address)

        if (db) {
          let entry
          if (db.type === 'eventlog' || db.type === 'feed')
          entry = await db.iterator({ limit: 10 }).collect().reverse()
          else if (db.type === 'counter')
          entry = [{ payload: { value: db.value } }]
          else if (db.type === 'keyvalue')
          entry = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
          else if (db.type === 'docstore')
          entry = db.query(e => e !== null, {fullOp: true}).reverse()
          else
          entry = [{ payload: { value: "TODO" } }]

          setDb(db)
          setEntries([...entry])
          setLoading(false);
        }
      }
    fetchDB(props.address)
  },[props.address, setDb, setEntries])

  function copyToClipboard() {
    var copyText = document.querySelector("#address");
    var range = document.createRange();
    range.selectNode(copyText);
    window.getSelection().addRange(range);
    // console.log('Copied ',copyText,' to the clipboard')
    document.execCommand("copy");
  }

  return (
      <div>
      {db?
        <div>
        <span>
          <p>Address: </p>
          <p id='address'>{props.address}
          <button onClick={()=>copyToClipboard()}><img src={copy} alt='copy to clipboard' width="20" height="23"></img></button>
          </p>
        </span>
        {loading? 'loading..':
        <div>
          {entries && entries.length > 0?
            <table>
              <tr>
                {db._type !== 'counter'?
                <th>key</th>
                :null}
                <th>value</th>
              </tr>
            {entries.map((x, item)=>{return (
              <tr key={item}>
                {db._type === 'keyvalue' || db._type === 'eventlog'?
                  <td>{x.payload.value.key}</td>
                :null}
                {db._type === 'docstore'?
                  <td>{x.payload.value._id}</td>
                :null}

                {db._type === 'keyvalue'?
                  <td>{x.payload.value.value.value}</td>
                :null}
                {(db._type === 'eventlog' || db._type === 'docstore')?
                  <td>{x.payload.value.value}</td>
                :null}
                {db._type === 'counter'?
                  <td>{x.payload.value}</td>
                :null}

              </tr>
            )})}

          </table>
          :null}
        </div>
        }

        <div>
        <DBTools
          db = {db}
          canWrite = {canWrite(db)}
          setEntries = {setEntries}
        />
        </div>
      </div>
      :'There are no entries in this database, make the first!'}
    </div>


  );
}
export default EditModal;
