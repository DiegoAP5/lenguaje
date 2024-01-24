import './App.css';
import React, { useState } from "react";
import stack from "./Validator";
import CodeMirror from "@uiw/react-codemirror";
import icono from './assets/reproducir.png'

function App() {

  const [code, setCode] = useState("");
  const [stacks, setStacks] = useState([]);
  const [isValid, setIsValid] = useState(undefined);

  const submitInputString = () => {
    setStacks(stack(code));
  }

  return (
    <div className='app'>
        <h1 className='header'>grntScript</h1>
        <div className={`input-container ${isValid ? 'valid' : 'invalid'}`}>
            <CodeMirror
              className='input'
              value={code}
              height="400px"
              width="880px"
              onChange={(editor,) => {
                setCode(editor);
              }}
            />
        </div>
        
        <button
        className='btn'
          onClick={submitInputString}
        >
          <img src={icono} alt="Reproducir" />
        </button>
        <h2 className="pilaTitle">Cadena {
          isValid === undefined ? null :  isValid ? <span className="message correct">Cadena válida</span> : <span className="message failed">Error en sintaxis</span>
        }</h2>
        <div className="stacksContainer">
          <table>
            <tbody>
              <tr>
                <th>Lexema</th>
                <th>Token</th>
                <th>Descripción</th>
              </tr>
          {
            stacks.map((element)=>{
              return (

                <tr className={!element[3] ? "error" : ""}>
                  <td>
                    {element[0]}
                  </td>
                  <td>
                    {element[1]}
                  </td>
                  <td>
                    {element[2]}
                  </td>
                </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
    </div>
);
}

export default App;
