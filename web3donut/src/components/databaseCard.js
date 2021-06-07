import React, {useState} from "react";
import DBTools from './databaseTools';
import IPFSTools from './ipfsTools';

import {getDagCid, getDagObject, getTreeIpfs} from '../libs/databaseLib';
// import {fetchDB} from './systems';

function DBCard(props) {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState('');
  const canWrite = props.db.access._write.includes(props.user) || props.db.access._write[0] ==='*';

  function ipldExplorer(address) {
    let url = `https://explore.ipld.io/#/explore/${address}`
    if(url) window.open(url, '_blank').focus();
  }

// continue debugging databaseTools for usage of DBs
  async function retrieve(type, cid, path){
      let mod = ''
      let text = ''
      let data
      switch (type){
        case 'get':
          data = props.db.get(cid)
          text = 'database get (db.get(key)) gives you: (check console)  '
          break
        case 'dag':
            data = await getDagCid(cid)
            text = 'ipfs.dag.get(cid, {path}) gives you: (check console) '
            break
        case 'dagCat':
            data = await getDagObject(cid)
            text = 'ipfs.cat(cid) gives you: (check console) '
            break
        case 'tree':
            data = await getTreeIpfs(cid)
            text = 'ipfs.dag.tree(cid, {path}) gives you: (check console) '
            break
        default:
          data = 'te'
          text = 'Otro caso'
          break

      }
      console.log(data)
      mod = (
        <div>
          <p> Tip: <br />{text}
        {/*  <p> {data.payload.value.value}</p>*/}
          </p>
        </div>
      )
      setTip(mod);
  }

  return (
    <div>
      <div onClick={()=>setOpen(!open)}>
      <span>{props.name} </span>
      {/*<button onClick={()=>console.log('fetchDB(props.db.id, props.db.dbname)')}>Refresh</button>*/}
      </div>
      {(open && props.db)?
        <div>
          <div style={{fontSize:'16px'}} onClick={()=>setOpen(!open)}>
            <p>{props.db.id}</p>
            <p>type: {props.db._type}</p>
            <p>access: <button onClick={()=>console.log('user database?')}>{props.db.access._write[0] ==='*' ? 'public' : props.db.access._write[0].slice(0,5)}..</button></p>
            <p>Can i write: {canWrite ? 'Yes!':'No!'}</p>
          </div>
          <ul>
          {(props?.entries?.length > 0)?
            <div>
            <hr class="solid"></hr>
            <p style={{fontSize:'14px'}} >latests {props.entries.length > 5 ? 5 : props.entries.length} events..</p> <br />
            {props.entries.map((x, item)=>
              {return (<li key={x.payload.value.timestamp}>
                key: {x.payload.value.key}{' - '}
                <button onClick={()=>{retrieve('get', x.payload.value.key)}}>GET</button>
                {props.db._type === 'eventlog'?
                  <span>{' - '}
                  value: {x.payload?.value?.value? x.payload.value.value.slice(0,4) : 'loading'}...
                  <button onClick={()=>retrieve('dagCat',x.payload.value.value)}>CAT</button>
                  <button onClick={()=>ipldExplorer(x.payload.value.value)}>Explorer</button>
                  <button onClick={()=>retrieve('dag', x.payload.value.value)}>DAG.GET</button>
                  <button onClick={()=>retrieve('tree',x.payload.value.value)}>DAG.TREE</button> 
                  </span>
                :null}
                </li>)})}
                {tip !== ''? tip : null}
                </div>
                :<p>DB is not replicated or has 0 entries, please wait and/or update databases</p>}
          </ul>
          <DBTools
            db = {props.db}
            canWrite = {canWrite}
          />
          <IPFSTools />

        </div>
        : null
      }
        <hr class="solid"></hr>

    </div>

  );
}

export default DBCard;
