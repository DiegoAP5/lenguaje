export default class Translator {
    constructor(indent = 2) {
        this.indent = indent
    }

    multiplicarCaracter(caracter, veces) {
        var resultado = "";
        for (var i = 0; i < veces; i++) {
            resultado += caracter;
        }
        return resultado;
    }

    /**
     * 
     * @param {string} code 
     * @param {number} maximum_calls 
     * @returns 
     */
    cure(code, maximum_calls = 30) {

        if(code.length === 192){
            return '// You have to write your code first...'
        }

        let result_code = '/*\nThis is the safe code to evaluate, it uses additional functions to\nhave a better coupling with the program that contains it. \n*/\n'
        result_code += '{\n'
        result_code += `const logs = [];\n`
        result_code += `const error = (message, details) =>{logs.push([message, "warn"]); logs.push([details, "details"])}\n`
        result_code += `const print = (message) =>{logs.push([ message, "notself"])}\n`

        if (code.includes("//@CHECKER")) {
            result_code += `let MAXIMUM_CALL = ${maximum_calls};\n`
        }
        result_code += code.replace("//@CHECKER", `if(MAXIMUM_CALL <= 0){MAXIMUM_CALL = ${maximum_calls}; error("Sandbox runtime overflow warning: Iteration overflow","Your iteration loop has exceeded the maximum iteration limit of the sandbox."); break} MAXIMUM_CALL--\n`)
            .replace(/console\.log/g, 'print')
        .replace(/\/\*[\s\S]*?\*\//g, '\n// Your code starts here...\n// Note: console.log() have been replaced by print().');
        result_code += '// Your code ends here.\n'
        result_code += '\nlogs;\n}'
        return result_code
    }

    translate(lexem, step = -1, struct = undefined, times = 0) {

        if (lexem == '}') {
            return this.multiplicarCaracter(" ", (times - 1) * this.indent) + "}" + "\n"
        }

        const dict = {
            "VARIABLES": [
                this.multiplicarCaracter(" ", (times - 1) * this.indent) + "let ",
                lexem,
                " = ",
                lexem,
                ";\n"
            ],
            "FUNCION": [
                this.multiplicarCaracter(" ", (times - 1) * this.indent),
                "function ",
                lexem,
                lexem,
                lexem + "{\n"
            ],
            "IMPRESION": [
                this.multiplicarCaracter(" ", (times - 1) * this.indent) + "console.log",
                lexem,
                '"',
                lexem,
                '"',
                lexem,
                lexem + "\n",
            ],
            "CONDICION": [
                this.multiplicarCaracter(" ", (times - 1) * this.indent) + "if",
                lexem,
                `${lexem}`,
                ` ${lexem} `,
                `${lexem}`,
                lexem + "{\n",

            ],
            "FORLOOP": [
                this.multiplicarCaracter(" ", ((times - 1) * this.indent) * this.indent)
                + "for",
                lexem,
                `let ${lexem}`,
                ` ${lexem} `,
                `${lexem}`,
                `${lexem}`,
                ` ${lexem}`,
                ` ${lexem} `,
                `${lexem}`,
                `${lexem} `,
                lexem,
                lexem,
                lexem + `{\n${this.multiplicarCaracter(" ", ((times - 1) * this.indent) * this.indent)}//@CHECKER\n`,
            ],

            "CALL_FUNCTION": [
                this.multiplicarCaracter(" ", ((times - 1) * this.indent) * this.indent),
                lexem,
                lexem,
                lexem,
                lexem + "\n",
            ]
        }
        if (!Object.keys(dict).includes(struct)) {
            return lexem
        }
        return dict[struct][step];
    }
}