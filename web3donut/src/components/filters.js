import React, {useState, useEffect} from "react";
import Donut from "./D3Graphs/donut";
import CollapsibleTree from "./D3Graphs/collapsibleTree";
import {getDagObject, getTreeIpfs} from '../libs/databaseLib';
import {useStateValue } from '../state';
const protocolsData = require("../libs/eth-ecosystem");

function Filters(props) {
  const [appState] = useStateValue();
  // const [selection, setSelection] = useState();
  const [data, setData] = useState(protocolsData);
  const [search, setSearch] = useState();
  const [results, setResults] = useState([]);
  const [dataGraphed, setDataGraphed] = useState();
  const [vis,setVis] = useState('sunburst');

  const dataCid = async (cid) => {return getDagObject(cid)}

  async function getLatestDB(type){ // this should handle different DBs
    let entries;
    let cid;
    let dagObj;
    let result;
    switch (type) {
      case 'ipfsDag':
        let children = []
        entries = appState.entriesDAGtest[0]
        cid = await getDagObject(entries.payload.value.value)
        console.log('datacid',cid)
        dagObj = await getDagObject(cid.value)
        console.log('dagOb', dagObj)
        let dagTree = await getTreeIpfs(cid.value)
        console.log('obj tree', dagTree)
        for(let branch in dagObj){
          if(branch !== 'name'){
            console.log(dagObj[branch])
            let obj = await getDagObject(dagObj[branch])
            children.push(obj.children[0])
          }
        }


        result = {name:dagObj.name,children:children}
        break;
      case 'ipfsObject':
        entries = appState.entries[0] // [0] is the last log
        cid = await dataCid(entries.payload.value.value)
        dagObj = await dataCid(cid.value)
        console.log('dagOb', dagObj)
        result = dagObj

        break;
      default:
          return
    }
    console.log(entries)
    setData(result)
    return result;

    // if(!entries){ // and so entries wouldn't be the only choice
    //   return
    // }
    // As Object
    // As DAG (data in a CID inside the DB CID)
    // let dagC = (await  getDagCid(dataCid2.value.value)).value
    // console.log('Cid retrieval: ',dagC)
  }

// const current = (await ipfs.dag.get(cid)).value // to get internal searches of cid's


  function exploreTree(arr, term, matches){
    arr.forEach(function(i) {
        if (i.name.toLowerCase().includes(term.toLowerCase())) {
            matches.push(i);
        } else {
            let childResults = findResults(i.children, term);//
            if (childResults.length)
                matches.push(Object.assign({}, i, { children: childResults }));
        }
    })
  }

  function findResults(arr,term){
    let matches = [];
    if (!Array.isArray(arr)) return matches;
    if (term === '') return arr;
    exploreTree(arr, term, matches);
    setResults(matches);
    if(matches !== results){
      setDataGraphed(treeSearch(matches))
      }
    return matches;
  }

  function clearResults(){
    setDataGraphed('')
    setResults([]);
  }

  useEffect(()=>{ // Search bar effect
      if(search !== '' && search !== undefined && search.length > 2){
        findResults(data.children, search)
      }else{
        clearResults();
      }
  },[search]); // eslint-disable-line react-hooks/exhaustive-deps


  // function getFlat({ name, children = [] }) { // get all names in a tree obj
  //   return [name].concat(...children.map(getFlat));
  // }
  // function hasChildren(node) {
    //   return (typeof node === 'object')
    //       && (typeof node.children !== 'undefined')
    //       && (node.children.length > 0);
    // }
  const treeSearch = (res) => {return {name:"ethereum", children:res}};

  return (
      <div
        id="filters"
        style={{
          justifyContent: "left",
          alignItems: "left",
        }}

      >
      <hr class="solid"></hr>
      Database type:
      <button onClick={()=>{
        setData(protocolsData)
      }}>local</button>
      <button disabled={!appState.entries.length >0} onClick={()=>{getLatestDB('ipfsObject')}}>ipfsObject</button>
      <button disabled={!appState.entriesDAGtest.length >0} onClick={()=>{getLatestDB('ipfsDag')}}>ipfsDAG</button><br />
      <hr class="solid"></hr>
        <div
          style={{
            display:'flex',
            justifyContent:'top',
            alignItems:'left',
            margin:"0vh auto"
          }}
          id='environment'>
        <input placeholder='Search' onChange={(e)=>setSearch(e.target.value)}></input><br />
        <span>Graph type:
          <button onClick={()=>setVis('sunburst')}>donut</button>
          <button onClick={()=>setVis('collapsibleTree')}>tree</button>
        </span>
        </div>

        {vis === 'sunburst'?
          <Donut
          data = {data}
          dataGraphed = {dataGraphed}
          />
        :null}
        {vis === 'collapsibleTree'?
        <CollapsibleTree
        data = {data}
        dataGraphed = {dataGraphed}
        />
        :null}
      {/*results?
        <ul>
        {results.map(x=>{return <li key={x.name}>{x&&x.children?
          <button onClick={()=>console.log(x)}>{x.name}/{x.children[0].name}</button>
          :x.name}</li>})}
          </ul>
          :null*/}
      {/*selection?
        <div>
        <h3>{selection.name}</h3>
        <a>{selection.url}</a>
        </div>
        :null*/}
      </div>

  );
}

export default Filters;
