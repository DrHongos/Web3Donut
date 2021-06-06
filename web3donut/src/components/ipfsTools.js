import React, {useState} from "react";
import { dagPreparation, getFromIpfs, addIpfs, getIpfs } from '../libs/databaseLib';
// import { actions, useStateValue } from '../state'

function IPFSTools(props) {
  const [open, setOpen] = useState(false);
  // const [appState, dispatch] = useStateValue();
  const [getFromIpfsModal, setGetFromIpfsModal] = useState(false);
  const [getFileIpfsModal, setGetFileIpfsModal] = useState(false);
  const [createDag, setCreateDag] = useState(false);
  const [addIpfsModal, setAddIpfsModal] = useState(false);


  async function SearchIPFS(){
    let cid = document.getElementById('getFile').value;
    let result = await getFromIpfs(cid);
    console.log(result)
    return result;
  }

  async function getCidIPFS(){
    let cid = document.getElementById('getIpfs').value;
    let result = await getIpfs(cid);
    let test = new TextDecoder().decode(result)
    console.log(test)
    return result;
  }


  async function uploadDag(){
    let value = document.getElementById('dagData').value.toString();
    try{
      let cid = await dagPreparation(JSON.parse(value));
      console.log(cid.toString())
      console.log('Now is your responsability to make something cool!')
      return cid;
    }catch{
      console.log('Error in JSON.parse! please use a json format')
    }
  }

  async function addFileIpfs(){
    const selectedFile = document.getElementById('fileInput').files[0];
    let cid
    let reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onloadend = function () {
        cid = addIpfs(reader.result);
        return cid;
      };
    // if(results.length > 0){
    //   for await (const { cid } of results) {
    //     console.log(cid.toString())
    //   }
    //   return results;
    // }else{
    //   return 'There was a problem'
    // }
  }



  return (
    <div>
      <button onClick={()=>{setOpen(!open)}}>Other tool's</button>
      {open?
        <div>

          {/* IPFS various */}
          <button onClick={()=>setCreateDag(!createDag)}>create DAG</button>
          <button onClick={()=>setGetFromIpfsModal(!getFromIpfsModal)}>Get ipfs</button>
          <button onClick={()=>setGetFileIpfsModal(!getFileIpfsModal)}>Get file</button>
          <button onClick={()=>setAddIpfsModal(!addIpfsModal)}>Add file to ipfs</button>

          {getFromIpfsModal?
            <div>
            <input id='getIpfs' placeholder='Qm..'></input><br />
            <button onClick={()=>{getCidIPFS()}}>ipfs.get(cid) </button>
            </div>
            :null}
          {getFileIpfsModal?
            <div>
            <input id='getFile' placeholder='Qm..'></input><br />
            <button onClick={()=>{SearchIPFS()}}>get file blocks!</button>
            </div>
            :null}
          {createDag?
            <div>
            <input id='dagData' placeholder='dag data'></input><br />
            <button onClick={()=>{uploadDag()}}>Add to dag</button><br />
            </div>
            :null}
          {addIpfsModal?
            <div>
            <input type="file"
              id="fileInput">
           </input>
            <button onClick={()=>{addFileIpfs()}}>Add to IPFS</button><br />
            </div>
            :null}
        </div>
      :null}

    </div>
  );
}

export default IPFSTools;
