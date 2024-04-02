import semantic_rules from '../data/semantic.json'
import Translator from './Translator';

export default class Semantic {
    constructor(data) {
        this.data = data.data;
        this.structure = null
        this.logs = []
        this.translator = new Translator();
    }

    run() {
        this.logs.push(["Initializing semantic analyzer and translator...", "default"])
        let last_step = -1
        let names_masks = {}
        let scope = { global: {} }
        let scope_queue = ['global']
        let transpiled_code = '/*\nThe code shown in this part is functional, but for security reasons it is not the program \nthat the interpreter evaluates, instead minor modifications are made to ensure safe execution.\n*/\n'

        for (let item in this.data) {
            const token = this.data[item]
            const current_scope = scope_queue[scope_queue.length - 1]

            if (token["LEXEM"] === '{') {
                let new_scope_name = this.random_name()

                scope_queue.push(new_scope_name)
                scope[new_scope_name] = {}
                continue
            }

            if (token["LEXEM"] === '}') {
                scope_queue.pop()
                transpiled_code += this.translator.translate('}', undefined, undefined, scope_queue.length)
                continue
            }

            const rule = semantic_rules[token["STRUCTURE"]][token["STEP"]];

            if (rule === undefined) {
                transpiled_code += this.translator.translate(token["LEXEM"], token["STEP"], token["STRUCTURE"], scope_queue.length)
                continue
            }

            if (rule["registable"]) {

                for (let i = 0; i < scope_queue.length; i++) {
                    const temporal_scope = scope_queue[i];
                    if (scope[temporal_scope][token["LEXEM"]] !== undefined) {
                        this.logs.push([`Reference error: Name of the variable or function in use.`, "error"])
                        this.logs.push([`This name is already in use >${token["LEXEM"]}< on line ${token["LINE_NUMBER"]}.`, "details"])
                        return { has_error: true, code: '' }
                    }
                }


                scope[current_scope][token["LEXEM"]] = 0
                names_masks[token["LEXEM"] + current_scope] = this.random_name()
                token["LEXEM"] = names_masks[token["LEXEM"] + current_scope]

            }

            if (rule["reference"]) {
                let found = false;

                if (token["ID"] === 'integer_number') {
                    transpiled_code += this.translator.translate(token["LEXEM"], token["STEP"], token["STRUCTURE"], scope_queue.length)
                    continue
                }

                for (let i = 0; i < scope_queue.length; i++) {
                    const temporal_scope = scope_queue[i];

                    if (scope[temporal_scope][token["LEXEM"]] !== undefined) {

                        scope[temporal_scope][token["LEXEM"]] += 1
                        token["LEXEM"] = names_masks[token["LEXEM"] + temporal_scope]

                        found = true
                        break;
                    }
                }

                if (!found) {
                    this.logs.push([`Reference error: Name of function or variable not found.`, "error"])
                    this.logs.push([`The function or variable with the name >${token["LEXEM"]}< in line ${token["LINE_NUMBER"]} could not be located in any context.`, "details"])
                    return { has_error: true, code: '' }
                }

            }

            transpiled_code += this.translator.translate(token["LEXEM"], token["STEP"], token["STRUCTURE"], scope_queue.length)
            if (last_step > token["STEP"] || this.structure !== token["STRUCTURE"]) {
                this.structure = token["STRUCTURE"]
            }
        }

        this.verify_unused_names(scope);
        this.logs.push(["Semantic review and translation completed.", "success"])
        return { has_error: false, code: transpiled_code, procesed_code: this.translator.cure(transpiled_code) }
    }

    random_name() {
        const letters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
        let result = ''
        for (let i = 0; i < 10; i++) {
            result += letters[Math.floor(Math.random() * ((letters.length - 1) - 0 + 1) + 0)]
        }
        return result;
    }

    verify_unused_names(scope) {
        for (let i in scope) {
            const current_scope = scope[i]

            for (let key in current_scope) {

                if (current_scope[key] === 0) {
                    this.logs.push([`Function or variable not used.`, "warn"])
                    this.logs.push([`The function or variable >${key}< has been declared but never used.`, "details"])
                }
            }
        }
    }
    get_logs() {
        return this.logs;
    }
}