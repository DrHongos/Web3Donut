import React, {useState} from "react";

function DBCard(props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div onClick={()=>setOpen(!open)}>
      <h3>{props.name}</h3>
      </div>
      {open?
        <ul>
        {(props?.entries?.length > 0)?
          <div>
          <hr class="solid"></hr>
          {props.entries.map((x, item)=>
            {return (<li key={x.payload.value.value}>
              <button onClick={()=>{console.log(props.db.get(x.payload.value.key))}}>{x.payload.value.key?x.payload.value.key:'Data'}</button>

              </li>)})}
              </div>
              :<p>DB is not replicated or has 0 entries, please wait and/or update databases</p>}
        </ul>
        : null
      }
      {/* Tools for logs
        <button onClick={()=>getDag(x.payload.value.value)}>{x.payload?.value?.value? x.payload.value.value.slice(0,4) : 'loading'}...</button>
        <button onClick={()=>ipldExplorer(x.payload.value.value)}>Explorer</button>
        <button onClick={()=>getDagCid(x.payload.value.value)}>get Dag Cid</button>
        <button onClick={()=>getTreeIpfs(x.payload.value.value)}>get Dag Tree</button>
        */}
        <hr class="solid"></hr>

    </div>

  );
}

export default DBCard;
