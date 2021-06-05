import React, {useState, useEffect} from "react";
import Donut from "./donut";
import {getDagObject} from '../libs/databaseLib';
import {useStateValue } from '../state';
const protocolsData = require("../libs/eth-ecosystem");

function Filters(props) {
  const [appState] = useStateValue();
  // const [selection, setSelection] = useState();
  const [data, setData] = useState(protocolsData);
  const [search, setSearch] = useState();
  const [results, setResults] = useState([]);
  const [dataGraphed, setDataGraphed] = useState();

  async function getLatestDB(){ // this should handle different DBs
    if(!appState.entries[0]){ // and so entries wouldn't be the only choice
      return
    }
    // As Object
    let dataCid = await getDagObject(appState.entries[0].payload.value.value)
    let dagOb = await getDagObject(dataCid.value)
    let result = dagOb
    // As DAG (data in a CID inside the DB CID)
    // let dagC = (await  getDagCid(dataCid2.value.value)).value
    // console.log('Cid retrieval: ',dagC)

    setData(result)
    return result;
  }


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
      <button onClick={()=>{getLatestDB('ipfsObject')}}>ipfsObject</button>
      <button disabled onClick={()=>{console.log('ipfsDag')}}>ipfsDAG</button><br />
      <hr class="solid"></hr>
      <div
        style={{
          display:'flex',
          justifyContent:'top',
          alignItems:'left',
          margin:"0vh auto"
        }}
        id='environment'>
        <input placeholder='Search' onChange={(e)=>setSearch(e.target.value)}></input>
        </div>

      <Donut
        data = {data}
        dataGraphed = {dataGraphed}
      />

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
