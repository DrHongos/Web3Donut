import React, {useState} from "react";

function ObjectCreator(props) {
  const [fields, setFields] = useState([]);

  function deleteItem(e){
    let fieldsCurrent = [...fields]
    const index = fields.indexOf(fields.find(x=>x.key === e));
    if (index > -1) {
      fieldsCurrent.splice(index, 1);
      setFields(fieldsCurrent)
      console.log("removing: ",e)
    }
  }

  function nameProject(){
    let name = document.getElementById('name').value;
    const obj = {key:'name', value:name}//[, {key:'key', value:name}] // test the key here
    setFields(prevState => (
      [...prevState, obj]
    ))
  }

  function addItem(){
    let key = document.getElementById('key').value;
    let value = document.getElementById('value').value;
    const obj = {key:key, value:value}
    setFields(prevState => (
      [...prevState, obj]
    ))
    document.getElementById('key').value = '';
    document.getElementById('value').value = '';
  }

  async function createObject(){
    const result = Object.fromEntries(fields.map(k => [k["key"], k["value"]]))
    console.log(JSON.stringify(result))
    await props.createEntry(result['name'],JSON.stringify(result))
    }

  return (
      <div>
        <hr class="solid"></hr>
        <div>
          {fields.length > 0?
            <div>
              <ul>
                {fields.map(x=>{return(
                    <li>key: {x.key} - value: {x.value} - <button onClick={()=>deleteItem(x.key)}>delete</button></li>
                )})}
              </ul>
              <div>
                <input id='key' placeholder='Classificator'></input>
                <input id='value' placeholder='value'></input>
                <button onClick={()=>addItem()}>Add property</button>
              </div>
              <input type='checkbox' value={props.wrap} checked={props.wrap} onChange={()=>{props.setWrap(!props.wrap)}}></input>Wrap value in a DAG
              <br />
              <button onClick={()=>createObject()}>Finish object</button>

            </div>
          :
          <div>
            <input id='name' placeholder='name'></input>
            <button onClick={()=>nameProject()}>Name the project</button>
          </div>
        }


        </div>
      </div>

  );
}

export default ObjectCreator;
