import "../assets/styles/App.css";
import React, { useState } from "react";
import Lexer from '../modules/Lexer.js'
import CodeMirror from "@uiw/react-codemirror";
import { langs } from '@uiw/codemirror-extensions-langs';
import icono from "../assets/images/reproducir.png";
import Grammar from "../modules/Grammar.js";
import symbols from "../data/symbols.json";
import grammar from "../data/grammar.json";

function App() {
  const [code, setCode] = useState("");
  const [stacks, setStacks] = useState([]);
  const [isValid, setIsValid] = useState("valid");
  const [consoleMsg, setConsoleMsg] = useState([
    ["Waiting for execution", "default"],
    // ["Waiting for compilation...", "success"],
    // ["Waiting for compilation...", "warn"],
    // ["Waiting for compilation...", "error"],
    // ["Waiting for compilation...", "section"],
    // ["Waiting for compilation...", "final"],
    // ["Waiting for compilation...", "details"],
  ]
  );
  const [consoleClass, setConsoleClass] = useState("");
  const [interCode, setInterCode] = useState(
    "/**\n The intermediate code transpiled to javascript will be shown here. \n*/"
  );
  const [areHeaderVisibles, setAreHeaderVisibles] = useState(false);

  const submitInputString = () => {

    setConsoleMsg(prevConsoleMsg => [["Initiating...", "default"]]);

    const lexer_instance = new Lexer(symbols)
    let lexer_result = lexer_instance.validate(code);

    setConsoleMsg(prevConsoleMsg => prevConsoleMsg.concat(lexer_instance.get_logs()));

    setStacks(lexer_result);
    setAreHeaderVisibles(lexer_result.length > 0);

    const grammar_validator = new Grammar(grammar, lexer_result);
    const grammar_result = grammar_validator.check()

    setConsoleMsg(prevConsoleMsg => prevConsoleMsg.concat(grammar_validator.get_logs()));
    // console.log(grammar_result)

    if (grammar_result.has_error) {
      setIsValid(grammar_result.has_error);
      return
    }

    console.log("Pasó")

    // let [clazz, message, valid] = grammar_validator.check();
    // setConsoleClass(clazz);
    // setConsoleMsg(message);
  };

  return (
    <div className="app">
      <h1 className="header">grntScript</h1>
      <div className={`input-container ${isValid ? "valid" : "invalid"}`}>
        <CodeMirror
          theme={"dark"}
          className="input"
          value={code}
          height="400px"
          width="880px"
          onChange={(editor) => {
            setCode(editor);
          }}
        />
      </div>

      <button className="btn" onClick={submitInputString}>
        <img src={icono} alt="Reproducir" />
      </button>

      {/* <h2 className="pilaTitle">Cadena {
        isValid === undefined ? null : isValid ? <span className="message correct">Cadena válida</span> : <span className="message failed">Error en sintaxis</span>
      }</h2> */}

      <div className="stacksContainer">
        <table>
          <tbody>
            {areHeaderVisibles ? (
              <tr>
                <th>Lexema</th>
                <th>Token</th>
                <th>Descripción</th>
              </tr>
            ) : (
              <></>
            )}

            {stacks.map((element, index) => {
              console.log(element)
              return (
                <tr className={!element["IS_VALID"] ? "error" : ""} key={index}>
                  <td>{element["LEXEM"]}</td>
                  <td>{element["ID"]}</td>
                  <td>{element["DESCRIPTION"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <CodeMirror
          theme={"dark"}
          height="400px"
          width="880px"
          editable={false}
          value={interCode}
          style={{ cursor: 'default' }}
          extensions={[langs.javascript()]}
        />
        <p className={`outconsole ${consoleClass}`}>
          {render_msgs(consoleMsg)}
        </p>
      </div>
    </div>
  );
}

function render_msgs(msgs_list) {
  const res = []
  for (let index in msgs_list) {
    res.push(<span className={msgs_list[index][1]} key={index}>
      {msgs_list[index][0]}
    </span>)
  }

  return res;
}

export default App;
