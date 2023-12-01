import React, { useState } from 'react';
import './index.css'

const CodeValidator = () => {
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(true);

    const rules = [
    { regex: /^\s*[\w]+\s*=\s*\d+\s*\s*$/, message: "La asignación no es válida." },
    { regex: /^\s*public\s+fnc\s+(main|[a-z|A-Z])+\(\)\s*{\s*$/, message: "La definición de la función no es válida." },
    { regex: /^\s*si\s*\(\s*\w+\s*[<>=!]=?\s*\w+\s*\)\s*{\s*$/, message: "La estructura de control 'si' no es válida." },
    { regex: /^\s*for\s+\w+\s*=\s*0;\s*\w+\s*<\s*\d+\s*;\s*\w+\+\+\s*{\s*$/, message: "El bucle 'for' no es válido." },
    { regex: /^\s*impr\(".*"\)\s*$/, message: "La instrucción de impresión no es válida." },
    { regex: /^\s*}\s*$/, message: "Cierre de bloque no válido." }
    ];

    const grammar = {
        'S': [['N', 'C1']],
        'C1': [['O', 'V']],
        'N': [['L', 'N'], ['L', 'D']],
        'V': [['D', 'D'], ['D', 'C4'], ['C', 'C5']],
        'C2': [['D', 'D'], ['D', 'C4']],
        'C5': [['L', 'C']],
        'O': [/\s*=$/], // Definir otros operadores si es necesario
        'L': [/^[0-9]$/],
        'D': [['0'], ['1'], ['2'], /* ... otros dígitos de '0' a '9' ... */ ],
        'P': [['.']],
        'C': [['"']]
    };
    
    const validateBrackets = (codeToValidate) => {
        const stack = [];
        const lines = codeToValidate.split('\n');
    
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
    
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
    
            if (char === '{') {
              stack.push({ line: i + 1, char: j + 1 });
            } else if (char === '}') {
              if (stack.length === 0) {
                return `Error: Llave de cierre sin correspondencia en la línea ${i + 1}, columna ${j + 1}`;
              }
              stack.pop();
            }
          }
        }
    
        if (stack.length > 0) {
          const lastUnclosed = stack.pop();
          return `Error: Llave de apertura en la línea ${lastUnclosed.line}, columna ${lastUnclosed.char} sin cierre correspondiente`;
        }
    
        return null; // No hay errores de llaves.
      };

    const validateLine = (line, lineNumber) => {
        for (let rule of rules) {
            if (rule.regex.test(line.trim())) {
            return null;
            }
        }
        return `Error en la línea ${lineNumber}: Sintaxis no reconocida. "${line.trim()}"`;
    };

    const validateCode = (codeToValidate) => {
    const lines = codeToValidate.split('\n');
    const newErrors = {};
    let hasBracketError = false;
    
    lines.forEach((line, index) => {
        const error = validateLine(line, index + 1);
        if (error) {
            newErrors[index] = error;
        }
    });

    const bracketError = validateBrackets(codeToValidate);
        if (bracketError) {
            newErrors['brackets'] = bracketError;
            hasBracketError = true;
        }

        setErrors(newErrors);

    };
    
    const isTerminal = (symbol) => {
        switch (symbol) {
            case 'L':
                return /^[a-z]$/; // Coincide con cualquier letra minúscula
            case 'D':
                return /^[0-9]$/; // Coincide con cualquier dígito
            default:
                return new RegExp(`^${symbol}$`); // Coincide exactamente con el símbolo
        }
    };
    
    const processRule = (stack, code, index) => {
        let top = stack.pop();
        let regex = isTerminal(top);
    
        if (regex.test(code[index])) {
            return [stack, index + 1, null];
        } else {
            return [stack, index, `Error: se esperaba '${top}' en la posición ${index}`];
        }
    };
    
    const validateCodeWithAutomata = (codeToValidate) => {
        let stack = ['O'];
        let index = 0;
        let newErrors = {};

        while (stack.length > 0 && index < codeToValidate.length) {
            let error;
            [stack, index, error] = processRule(stack, codeToValidate, index);
            if (error) {
                newErrors[index] = error;
                break; // Detener en el primer error por simplicidad
            }
        }

        if (stack.length > 0 || index < codeToValidate.length) {
            newErrors['general'] = 'El código no se pudo validar completamente.';
        }

        setErrors(newErrors);
    };

    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        validateCodeWithAutomata(newCode);
    };

    return (
        <div className='app'>
            <h1 className='header'>grntScript</h1>
            <textarea
                className={`${isValid ? 'textarea' : 'textarea-invalid'}`}
                value={code}
                onChange={handleCodeChange}
                placeholder="Escribe tu código aquí..."
            />
            <div style={{ marginLeft: '20px' }}>
                {Object.keys(errors).length > 0 ? (
                    <ul className='error-message'>
                    {Object.values(errors).map((error, index) => (
                        <li key={index} >
                            {error}
                        </li>
                    ))}
                    </ul>
                ) : (
                <p className='valid-message'>El código es válido.</p>
                )}
            </div>
        </div>
    );
};

export default CodeValidator;
