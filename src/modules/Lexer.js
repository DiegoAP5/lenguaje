class Lexer {

  constructor(symbols_table) {
    this.symbols = symbols_table
  }

  validate(input) {

    let code_sample = input.split("\n")
    let res = []

    for (let i in code_sample) {
      let current_line = code_sample[i].replace(/\s+/g, " ")
        .replace(/(:|{|}|,|\(|\)|;|>|<|==|=|!=|\+\+|--|"|“|”|'|\+)/g, " $1 ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter((token) => token.trim() !== "");
      res = res.concat(this.check_in_grammar(current_line, i))
    }

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
          result.push([lexem, rule.type, rule.description, true, line_number + 1, rule.scopable, rule.close_symbol]);
          lexemFound = true;
          break;
        }
      }

      if (!lexemFound) {
        result.push([lexem, "Unknown", "Sin coincidencia", false, line_number + 1, false, null]);
      }
    }

    return result;
  }
}

export default function stack(inputString, symbols) {
  const automata = new Lexer(symbols);
  const result = automata.validate(inputString);
  return result;
}
