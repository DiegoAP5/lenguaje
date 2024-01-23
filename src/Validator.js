class Validator {
    constructor() {
        this.stack = ['$'];
        this.states = []
    }

    validate(input) {

        this.add(['S']);
        let pointer = 0;

        while (true) {
            console.log(this.stack);
            this.states.push([...this.stack]);
            const stackTop = this.topOfStack();
            const inputSymbol = input[pointer];

            if (stackTop === '$' && inputSymbol === undefined) {
                return { isValid: true, stack: this.states };
            }

            if (stackTop.length > 1 && this.isTerminal(stackTop)) {
                for (let i = 0; i < stackTop.length - 1; i++) {
                    if (stackTop[i] === input[pointer]) {
                    } else {
                        break;
                    }
                    this.remove();
                    pointer += stackTop.length;
                }
            } else if (stackTop === inputSymbol) {
                this.remove();
                pointer++;
            } else {
                const production = this.getProduction(stackTop, inputSymbol);
                if (production) {
                    this.remove();
                    this.add(production);
                } else {
                    return { isValid: false, stack: this.states };
                }
            }
        }
    }

    add(symbols) {
        for (let i = symbols.length - 1; i >= 0; i--) {
            this.stack.push(symbols[i]);
        }
    }

    remove() {
        return this.stack.pop();
    }

    topOfStack() {
        return this.stack[this.stack.length - 1];
    }

    isTerminal(symbol) {
        return symbol === symbol.toLowerCase();
    }


    getProduction(nonTerminal, terminal) {
        const ruleMappings = {
            'S': () => {
                const mappings = {
                    'v': () => ['L1', 'V1'],
                    'p': () => ['F', 'A1'],
                    'f': () => ['Y', 'T1'],
                    't': () => ['LL', 'B4']
                };
                return mappings[terminal] ? mappings[terminal]() : null;
            },

            // Variables var a = 2 var b = a
            'V1': () => ['L', 'V2'],
            'V2': () => ['O', 'V'],
            'V': () => {
                if(terminal !== undefined){
                    if (/[a-zA-Z]/.test(terminal)) {
                    return ['L']
                    } else if (/[0-9]/.test(terminal)) {
                        return ['D']
                    }
                }
                else{
                    return ' '
                }
            },

            // Funciones t(){}
            'B4': () => ['T', 'B6'],
            'B6': () => ['CA', 'CR'],

            // Main public fnc main(){si (3<5){impr("s")}}
            'A1': () => ['T', 'A2'],
            'A2': () => ['CA', 'A3'],
            'A3': () => ['C', 'CR'],
            'C': () => ['U', 'C1'],
            'C1': () => ['PA', 'C2'],
            'C2': () => ['RC', 'C3'],
            'C3': () => ['PC', 'C4'],
            'C4': () => ['CA', 'C5'],
            'C5': () => ['I', 'CR'],
            'RC': () => ['RC1', 'D'],
            'RC1': () => ['D', 'CC'],
            'I': () => ['I1', 'I2'],
            'I2': () => ['PA', 'I3'],
            'I3': () => ['H', 'I4'],
            'I4': () => ['L', 'I5'],
            'I5': () => ['H', 'PC'],

            // Ciclo for(i=0;4<5;i++){impr("s")}
            'T1': () => ['PA', 'R1'],
            'R1': () => ['KD', 'R2'],
            'R2': () => ['KA', 'R3'],
            'KA': () => ['D', 'KA1'],
            'KA1': () => ['CC', 'D'],
            'R3': () => ['KS', 'R4'],
            'R4': () => ['PC', 'J'],
            'J': () => ['CA', 'J3'],
            'J3': () => ['I1', 'J4'],
            'J4': () => ['PA', 'J5'],
            'J5': () => ['H', 'J6'],
            'J6': () => ['L', 'J7'],
            'J7': () => ['H', 'J8'],
            'J8': () => ['PC', 'CR'],


            //terminales
            'L1': () => ['var'],
            'CC': () => ['<'],
            'F': () => {
                if(!/^public\s+fnc\s+main$/.test(terminal)){
                    return ['public fnc main']
                }else{
                    return [' ']
                }
            },
            'I1': () => {
                if(/^i$/.test(terminal)){
                    return ['impr']
                }else{
                    return [' ']
                }
            },
            'U': () => ['si '],
            'Y': () => {
                if(!/^for$/.test(terminal)){
                    return ['for']
                }else{
                    return [' ']
                }
            },
            'L': () => /[a-zA-Z]/.test(terminal) ? [terminal] : ' ',
            'D': () => /[0-9]/.test(terminal) ? [terminal] : ' ',
            'L1': () => ['v '],
            'LL': () => ['t'],
            'O': () => ['='],
            'H': () => ['"'],
            'T': () => {
                if(/^(\(|\))*$/.test(terminal)){
                    return ['()']
                }else{
                    return [' ']
                }
            },
            'CA': () => ['{'],
            'CR': () => ['}'],
            'PA': () => ['('],
            'PC': () => [')'],
            'KD': () => ['i=0;'],
            'KS': () => {
                if(/^;$/.test(terminal)){
                    return [';i++']
                }else{
                    return [' ']
                }
            },
        }
        return ruleMappings[nonTerminal] ? ruleMappings[nonTerminal]() : null;
    }


}

export default function stack(inputString) {
    const automata = new Validator();
    const result = automata.validate(inputString);
    return result;
}