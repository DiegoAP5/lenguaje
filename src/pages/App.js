import "../assets/styles/App.css";
import React, { useEffect, useState, useRef } from "react";
import Lexer from '../modules/Lexer.js'
import CodeMirror from "@uiw/react-codemirror";
import { langs } from '@uiw/codemirror-extensions-langs';
import icono from "../assets/images/reproducir.png";
import Grammar from "../modules/Grammar.js";
import symbols from "../data/symbols.json";
import grammar from "../data/grammar.json";
import Semantic from "../modules/Semantic.js";

function App() {
  const [code, setCode] = useState("");
  const [stacks, setStacks] = useState([]);
  const [isValid, setIsValid] = useState("valid");
  const [consoleMsg, setConsoleMsg] = useState([
    ["Waiting for execution", "default"]
  ]
  );
  const default_out_code = "// The intermediate code transpiled to javascript will be shown here."
  const [consoleClass, setConsoleClass] = useState("");
  const [interCode, setInterCode] = useState(
    default_out_code
  );
  const [areHeaderVisibles, setAreHeaderVisibles] = useState(false);

  const consoleRef = useRef(null);


  const scrollToBottom = () => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  });

  const submitInputString = () => {
    const init_time = Date.now()

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
      setInterCode(default_out_code)
      return
    }

    const semantic = new Semantic(grammar_result)
    const semantic_result = semantic.run()

    setConsoleMsg(prevConsoleMsg => prevConsoleMsg.concat(semantic.get_logs()));

    if (semantic_result.has_error) {
      setInterCode(default_out_code)
      return
    }

    setInterCode(semantic_result.code)
    setConsoleMsg(prev => prev.concat([['Running your program...', 'section']]))
    const run_result = eval(semantic_result.procesed_code);
    if (run_result !== undefined && run_result.length != 0) {
      setConsoleMsg(prev => prev.concat(run_result))
    } else {
      setConsoleMsg(prev => prev.concat([["Your program has no console output.", "details"]]))
    }
    setConsoleMsg(prevConsoleMsg => prevConsoleMsg.concat([[`Program successfully executed in ${Date.now() - init_time}ms`, "final"]]));

    // let [clazz, message, valid] = grammar_validator.check();
    // setConsoleClass(clazz);
    // setConsoleMsg(message);
  };

  return (
    <div className="app">
      <h1 className="header">grntScript</h1>
      <div className={`input-container`}>
        <CodeMirror
          theme={"dark"}
          // className="input"
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
        <p className={`outconsole ${consoleClass}`} ref={consoleRef}>
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
