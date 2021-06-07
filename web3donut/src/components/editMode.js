import React, {useState, useEffect} from "react";
import {getDB} from "../libs/databaseLib";
import DBTools from './databaseTools';
import '../App.css'

function EditModal(props) {
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState(null);
  const [entries, setEntries] = useState([]);
  const canWrite = (db) =>{return db.access._write.includes(props.user) || db.access._write[0] ==='*'};

  useEffect(async ()=>{
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


  return (
      <div>
      {db?
        <div>
        <p>{props.address}</p>
        {loading? 'loading..':
        <div>
          {entries && entries.length > 0?
            <table>
              <tr>
                <th>key</th>
                <th>value</th>
              </tr>
            {entries.map((x, item)=>{return ( //Breaks with keyvalue DB
              <tr key={item}>
                <td>{x.payload.value.key}</td>
                {db._type === 'keyvalue'?
                  <td>{x.payload.value.value.value}</td>
                :
                <td>{x.payload.value.value}</td>
              }
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
        />
        </div>
      </div>
      :'There are no entries in this database, make the first!'}
    </div>


  );
}
// (Object.keys(productList).map(product => {<p key={productList[product].id}>{productList[product].name}</p>})
//
export default EditModal;
