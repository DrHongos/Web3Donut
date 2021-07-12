  import React, {useState, useEffect} from "react";
import Donut from "./D3Graphs/donut";
import CollapsibleTree from "./D3Graphs/collapsibleTree";
import {getDagObject} from '../libs/databaseLib'; //, getTreeIpfs
import {useStateValue } from '../state';
import { Select, HStack, Input, InputGroup,InputLeftElement } from "@chakra-ui/react";
import {Search2Icon} from '@chakra-ui/icons';

const protocolsData = require("../libs/modelsObjects/eth-ecosystem");
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
        // console.log('entries',entries)
        // first CID : gets the cid of value
        cid = await getDagObject(entries.payload.value.value)
        console.log('cid',cid)
        // Then gets the object of that cid
        dagObj = await getDagObject(cid.value)
        // supposedly a json object
        const dagObject = JSON.parse(dagObj.value) // objects has been stringified because of error on loading (?)
        console.log('dagObj',dagObject)

        // with different categories
        // let dagTree = await getTreeIpfs(cid.value)
        // console.log('obj tree', dagTree)
        for(let branch in dagObject){
          if(branch !== 'name'){ // ignore the name (and other metadata) to retrieve the sub objects
            // console.log('branch',branch)
            // we retrieve the object inside each category
            // console.log(dagObject[branch]) // i need to differentiate Qm.. from v1 CID's
            let obj = await getDagObject(dagObject[branch])
            // console.log('obj',obj)

            if(obj){
              children.push(obj)
            }else{
              // error in strucure.. show what's missing
              // obj = await getV0(dagObject[branch]);
              console.log(obj)
            }
          }
        }


        result = {name:dagObj.name,children:children}
        break;
      case 'ipfsObject':
        entries = appState.entries[0] // [0] is the last log
        cid = await dataCid(entries.payload.value.value)
        dagObj = await dataCid(cid.value)
        // console.log('dagOb', dagObj)
        result = dagObj

        break;
      default:
          return
    }
    // console.log(entries)
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

  const handleDatabase = (type) =>{
    if(type === 'local'){
      setData(protocolsData)
    }else{
      getLatestDB(type)
    }
  }

  return (
      <div
        id="filters"
        style={{
          justifyContent: "left",
          alignItems: "left",
        }}

      >

      <HStack>
        <Select w='25%' placeholder="Database selector" onChange={(e)=>handleDatabase(e.target.value)} >
          <option value="local">Local (hardcoded)</option>
          <option disabled={!appState.entries.length >0} value="ipfsObject">IPFS Object</option>
          <option disabled={!appState.entriesDAGtest.length >0} value="ipfsDag">IPFS DAG</option>
        </Select>

        <Select w='25%' placeholder="Graph type" onChange={(e)=>setVis(e.target.value)} >
          <option value="sunburst" default>Donut</option>
          <option value="collapsibleTree">Tree</option>
        </Select>

      <InputGroup >
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="gray.300" />}
          />
          <Input type="tel" placeholder="Search"
            onChange={(e)=>setSearch(e.target.value)}
          />
      </InputGroup>
      </HStack>

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

      </div>

  );
}

export default Filters;
