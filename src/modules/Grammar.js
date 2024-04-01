export default class Grammar {
    constructor(grammar_rules, tokens) {
        this.grammar = grammar_rules;
        this.tokens = tokens
        this.current_structure = null
        this.current_step = 0
        this.scope_debts = []
        this.logs = []
    }

    check() {
        const result = []
        this.logs.push(["Initializing grammar analyzer...", "default"])
        for (let i in this.tokens) {
            let token = this.tokens[i]
            if (!token["IS_VALID"]) {
                this.logs.push([`Lexical error: Illegal token.`, "error"])
                this.logs.push([`In line 12 the token >${token["LEXEM"]}< does not belong to the language.`, "details"])
                return this.__errorReponse(result)
            }

            if (token["LEXEM"] === '}') {
                if (this.scope_debts.length === 0 || this.current_step > 0 || this.current_structure !== null) {
                    this.logs.push([`Syntax error: Token unexpected.`, "error"])
                    this.logs.push([`on line ${token["LINE_NUMBER"]} token >${token["LEXEM"]}< unexpected.`, "details"])
                    return this.__errorReponse(result)
                }
                this.scope_debts.shift()
                continue;
            }

            if (this.current_structure == null) {
                let res = this.__findStructure(token["ID"])
                if (res) {
                    continue;
                }
                // Esto puede causar problemas a futuro
                this.logs.push([`Syntax error: Unrecognized instruction or token.`, "error"])
                this.logs.push([`on line ${token["LINE_NUMBER"]} the token >${token["LEXEM"]}< is not recognized as an instruction or internal reference.`, "details"])
                return this.__errorReponse(result)
            }

            let rule = this.grammar[this.current_structure][this.current_step]

            let isValidToken = rule.includes(token["ID"])


            if (isValidToken) {

                if (token["IS_SCOPABLE"]) {
                    this.scope_debts.push(token["CLOSE_SYMBOL"]);
                    this.current_structure = null;
                    this.current_step = 0;
                    continue;
                }

            } else {
                this.logs.push([`Syntax error: Token unexpected.`, "error"])
                this.logs.push([`on line ${token["LINE_NUMBER"]} token >${token["LEXEM"]}< unexpected. Expected ${this.__formatArrayToString(rule)}.`, "details"])
                return this.__errorReponse(result)
            }

            this.current_step++
            if (this.current_step >= this.grammar[this.current_structure].length) {
                this.current_structure = null
                this.current_step = 0
            }

            result.push(token)
        }

        if (this.scope_debts.length > 0) {
            this.logs.push([`Syntax error: characters are missing at the end.`, "error"])
            this.logs.push([`at the end of the document: ${this.scope_debts.length} >}< characters are missing at the end.`, "details"])
            return this.__errorReponse(result)
        }

        if (this.current_structure !== null) {
            this.logs.push([`Syntax error: Incomplete instruction.`, "error"])
            this.logs.push([`At the end of the document the following character was expected: ${this.__formatArrayToString(this.grammar[this.current_structure][this.current_step])}.`, "details"])
            return this.__errorReponse(result)
        }
        this.logs.push(["Grammar analyzer completed.", "success"])
        return { has_error: false, data: result }
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

    __errorReponse(data) {
        return { has_error: true, data: data }
    }

    get_logs() {
        return this.logs
    }
}