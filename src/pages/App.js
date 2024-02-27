import '../assets/styles/App.css';
import React, { useState } from "react";
import stack from "../modules/Lexer.js";
import CodeMirror from "@uiw/react-codemirror";
import icono from '../assets/images/reproducir.png'
import Grammar from '../modules/Grammar.js';
import symbols from '../data/symbols.json'
import grammar from '../data/grammar.json'

function App() {

  const [code, setCode] = useState("");
  const [stacks, setStacks] = useState([]);
  const [isValid, setIsValid] = useState("valid");
  const [consoleMsg, setConsoleMsg] = useState("_")
  const [consoleClass, setConsoleClass] = useState("")
  const [areHeaderVisibles, setAreHeaderVisibles] = useState(false)

  const submitInputString = () => {
    let result = stack(code, symbols)
    setStacks(result);
    setAreHeaderVisibles(result.length > 0)
    const grammar_validator = new Grammar(grammar, result)
    let [clazz,message,valid] = grammar_validator.check()
    setConsoleClass(clazz)
    setConsoleMsg(message)
    setIsValid(valid)
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
        isValid === undefined ? null : isValid ? <span className="message correct">Cadena válida</span> : <span className="message failed">Error en sintaxis</span>
      }</h2>
      <div className="stacksContainer">
        <table>
          <tbody>

            {
              areHeaderVisibles ? (
                <tr>
                  <th>Lexema</th>
                  <th>Token</th>
                  <th>Descripción</th>
                </tr>
              ) : (<></>)
            }

            {
              stacks.map((element, index) => {
                return (

                  <tr className={!element[3] ? "error" : ""} key={index}>
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
        <p className={`outconsole ${consoleClass}`}>
          {
            consoleMsg
          }
        </p>
      </div>
    </div>
  );
}

export default App;
