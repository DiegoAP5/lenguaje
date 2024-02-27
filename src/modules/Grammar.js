const [LEXEM_INDEX, TYPE_INDEX, DESCRIPTION_INDEX, IS_VALID_INDEX, LINE_NUMBER_INDEX, IS_SCOPABLE_INDEX, CLOSE_SYMBOL_INDEX] = [0, 1, 2, 3, 4, 5]

export default class Grammar {
    constructor(grammar_rules, tokens) {
        this.grammar = grammar_rules;
        this.tokens = tokens
        this.current_structure = null
        this.current_step = 0
        this.scope_debts = []
    }

    check() {
        for (let i in this.tokens) {
            const token = this.tokens[i]

            if (!token[IS_VALID_INDEX]) {
                return this.__errorReponse(`Lexical error on ${token[LINE_NUMBER_INDEX]}: Illegal "${token[LEXEM_INDEX]}" token.`)
            }

            if (token[LEXEM_INDEX] === '}') {
                if (this.scope_debts.length === 0 || this.current_step > 0 || this.current_structure !== null) {
                    return this.__errorReponse(`Syntax error on line ${token[LINE_NUMBER_INDEX]}: Token "${token[LEXEM_INDEX]}" unexpected.`)
                }
                this.scope_debts.shift()
                continue;
            }

            if (this.current_structure == null) {
                let res = this.__findStructure(token[TYPE_INDEX])
                if (res) {
                    continue;
                }
                return this.__errorReponse(`Syntax error on line ${token[LINE_NUMBER_INDEX]}: Token "${token[LEXEM_INDEX]}" unknown.`)
            }

            let rule = this.grammar[this.current_structure][this.current_step]

            let isValidToken = rule.includes(token[TYPE_INDEX])


            if (isValidToken) {

                if (token[IS_SCOPABLE_INDEX]) {
                    this.scope_debts.push(token[CLOSE_SYMBOL_INDEX]);
                    this.current_structure = null;
                    this.current_step = 0;
                    continue;
                }

            } else {
                return this.__errorReponse(`Syntax error on line ${token[LINE_NUMBER_INDEX]}: Token "${token[LEXEM_INDEX]}" unexpected. Expected ${this.__formatArrayToString(rule)}.`)
            }

            this.current_step++
            if (this.current_step >= this.grammar[this.current_structure].length) {
                this.current_structure = null
                this.current_step = 0
            }
        }

        if (this.scope_debts.length > 0) {
            return this.__errorReponse(`Syntax error at the end of the document: ${this.scope_debts.length} "}" characters are missing at the end.`)
        }

        return ["success", "The input string is valid.", true]

    }

    __findStructure(toke_type) {

        for (let structure in this.grammar) {
            const rule = this.grammar[structure]
            let res = rule[this.current_step].includes(toke_type)
            if (res) {

                this.current_structure = structure
                this.current_step++

                return true
            }
        }

        return false
    }

    __formatArrayToString(array) {

        if (array.length === 0) {
            return '';
        }
        if (array.length === 1) {
            return '"' + array[0] + '"';
        }
        if (array.length === 2) {
            return '"' + array[0] + '" or "' + array[1] + '"';
        }

        var lastItem = array.pop();
        var formattedString = array.map(item => '"' + item + '"').join(', ');
        return formattedString + ', or "' + lastItem + '"';

    }

    __errorReponse(message) {
        console.error(message)
        return ["error", message, false]
    }
}