import React, {useState, useEffect} from "react";

function SearchBar(props) {
  // const [selection, setSelection] = useState();
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

  function findResults(arr,term){
    let matches = [];
    if (!Array.isArray(arr)) return matches;
    if (term === '') return arr;
    exploreTree(arr, term, matches);
    setResults(matches);
    if(matches !== results){
      props.setDataGraphed(treeSearch(matches))
      }
    return matches;
  }

  function clearResults(){
    props.setDataGraphed('')
    setResults([]);
  }

  useEffect(()=>{
      if(search !== '' && search !== undefined && search.length > 2){
        findResults(props.protocolsData.children, search)
      }else{
        clearResults();
      }
  },[search]); // eslint-disable-line react-hooks/exhaustive-deps
  //

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
        id="searchBar"
        style={{
          justifyContent: "left",
          alignItems: "left",
        }}

      >
      <input placeholder='Search' onChange={(e)=>setSearch(e.target.value)}></input>
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

export default SearchBar;
