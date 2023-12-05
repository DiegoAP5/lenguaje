import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import validateAutomaton from "./Validator";
import CodeMirror from "@uiw/react-codemirror";

function App() {

  const [code, setCode] = useState("");
  const [stacks, setStacks] = useState([]);
  const [isValid, setIsValid] = useState(undefined);

  const submitInputString = () => {
    const result = validateAutomaton(code);
    setStacks(result.stack)
    setIsValid(result.isValid);
  }

  return (
    <div className='app'>
        <h1 className='header'>grntScript</h1>
        <CodeMirror
            value={code}
            height="400px"
            width="880px"
            onChange={(editor,) => {
              setCode(editor);
            }}
          />
        <button
          onClick={submitInputString}
        >
          Validar
        </button>
        <h2 className="pilaTitle">Estados de la pila ↓ {
          isValid === undefined ? null :  isValid ? <span className="message correct">Cadena válida</span> : <span className="message failed">Error en sintaxis</span>
        }</h2>
        <div className="stacksContainer">
          {stacks.map((stack, index) => (
            <div className="stack" key={index}>
              {stack.map((element, elementIndex) => (
                <div className="element" key={elementIndex}>{element}</div>
              ))}
            </div>
          ))}
        </div>
    </div>
);
}

export default App;
