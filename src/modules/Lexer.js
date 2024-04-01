export default class Lexer {

  constructor(symbols_table) {
    this.logs = []
    this.symbols = symbols_table
  }

  validate(input) {

    let code_sample = input.split("\n")
    let res = []
    this.logs.push(["Initializing lexical analyzer...", "default"])
    for (let i in code_sample) {
      let current_line = code_sample[i].replace(/\s+/g, " ")
        .replace(/(:|{|}|,|\(|\)|;|>|<|==|=|!=|\+\+|--|"|“|”|'|\+)/g, " $1 ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter((token) => token.trim() !== "");
      res = res.concat(this.check_in_grammar(current_line, i))
    }

    this.logs.push(
      [
        "Lexical analyzer completed.", "success"
      ]
    )
    return res;
  }

  check_in_grammar(lexems, line_number) {
    line_number = parseInt(line_number)
    const result = [];
    for (const lexem of lexems) {
      let lexemFound = false;

      for (const rule of this.symbols) {
        let exp = new RegExp(rule.rule)
        if (exp.test(lexem)) {
          result.push({ LEXEM: lexem, ID: rule.type, DESCRIPTION: rule.description, IS_VALID: true, LINE_NUMBER: line_number + 1, IS_SCOPABLE: rule.scopable, CLOSE_SYMBOL: rule.close_symbol });
          lexemFound = true;
          break;
        }
      }

      if (!lexemFound) {
        this.logs.push([`Lexeme not identified.`, "warn"])
        this.logs.push([`The lexeme >${lexem}< in line ${line_number + 1} could not be recognized.`, "details"])
        this.logs.push([`An error has not been raised, it will be evaluated by the grammar analyzer.`, "details"])
        result.push({ LEXEM: lexem, ID: "Unknown", DESCRIPTION: "Sin coincidencia", IS_VALID: false, LINE_NUMBER: line_number + 1, IS_SCOPABLE: false, CLOSE_SYMBOL: null });
      }
    }


    return result;
  }

  get_logs() {
    return this.logs
  }
}