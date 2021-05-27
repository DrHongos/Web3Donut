import React, {useState, useEffect} from "react";

function SearchBar(props) {
  const [selection, setSelection] = useState();
  const [search, setSearch] = useState();
  const [results, setResults] = useState([]);
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

  // function hasChildren(node) {
  //   return (typeof node === 'object')
  //       && (typeof node.children !== 'undefined')
  //       && (node.children.length > 0);
  // }

  function findResults(arr,term){
    let matches = [];
    if (!Array.isArray(arr)) return matches;
    exploreTree(arr, term, matches);
    setResults(matches);
    return matches;
  }

  function clearResults(){
    setResults([]);
  }

  useEffect(()=>{
      if(search !== '' && search !== undefined && search.length > 2){
        findResults(props.protocolsData.children, search)
      }else{
        clearResults();
      }
  },[search, props]);

  // function getFlat({ name, children = [] }) {
  //   return [name].concat(...children.map(getFlat));
  // }


  return (
      <div
        id="searchBar"
        style={{
          justifyContent: "left",
          alignItems: "left",
        }}
      >
      <input onChange={(e)=>setSearch(e.target.value)}></input>
{/*
        <button onClick={()=>getLastItems(results[0])}
      //   results.forEach((item) =>{
      //   let test = getFlat(item)
      //   console.log(test)
      // })}
      >Tests</button>
*/}
      {results?
        <ul>
          {results.map(x=>{return <li key={x.name}>{x&&x.children?
            <button onClick={()=>setSelection(x)}>{x.name}/{x.children[0].name}</button>
            :x.name}</li>})}
        </ul>
      :null}
      {selection?
        <div>
          <h3>{selection.name}</h3>
          <a>{selection.url}</a>
        </div>
      :null}
      </div>

  );
}

export default SearchBar;
