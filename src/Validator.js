class Validator {

  grammar = [
    {
      rule: /^var$/,
      type: "variable_definition_keyword",
      description: "Palabra reservada para declaración de variables.",
    },
    {
      rule: /^fnc$/,
      type: "function_definition_keyword",
      description: "Palabra reservada para definición de función.",
    },
    {
      rule: /^public$/,
      type: "public_access_keyword",
      description: "Palabra reservada para declarar acceso público.",
    },
    {
      rule: /^si$/,
      type: "if_statement_keyword",
      description: "Palabra reservada para condicional if.",
    },
    {
      rule: /^impr$/,
      type: "output_print",
      description: "Instrucción de impresión por pantalla.",
    },
    {
      rule: /^for$/,
      type: "for_loop_keyword",
      description: "Palabra reservada para ciclos for.",
    },
    {
      rule: /^=$/,
      type: "asignation_symbol",
      description: "Símbolo de asignación de valor.",
    },
    {
      rule: /^[a-zA-Z][a-zA-Z0-9]*$/,
      type: "entity_name",
      description: "Nombre válido para funciones y variables.",
    },
    {
      rule: /^\d+$/,
      type: "integer_number",
      description: "Número entero.",
    },
    {
      rule: /^\($/,
      type: "open_parentheses_symbol",
      description: "Símbolo de apertura de paréntesis.",
    },
    {
      rule: /^\)$/,
      type: "close_parentheses_symbol",
      description: "Símbolo de cierre de paréntesis.",
    },
    {
      rule: /^\{$/,
      type: "open_brackets_symbol",
      description: "Símbolo de apertura de corchete.",
    },
    {
      rule: /^\}$/,
      type: "close_brackets_symbol",
      description: "Símbolo de cierre de corchete.",
    },
    {
      rule: /^;$/,
      type: "delimiter_semicolor",
      description: "Símbolo de delimitación, punto y coma.",
    },
    {
      rule: /^\+\+$/,
      type: "increment_symbol",
      description: "Símbolo de cierre de corchete.",
    },
    {
      rule: /^\>$/,
      type: "greater_than_symbol",
      description: "Símbolo de mayor que.",
    },
    {
      rule: /^\<$/,
      type: "less_than_symbol",
      description: "Símbolo de menor que.",
    },
    {
      rule: /^("|')$/,
      type: "indistinct_comilla_symbol",
      description: "Símbolo de comilla indistinto.",
    },
    {
      rule: /^“$/,
      type: "open_comilla_symbol",
      description: "Símbolo de apertura de comilla.",
    },
    {
      rule: /^”$/,
      type: "close_comilla_symbol",
      description: "Símbolo de cierre de comilla.",
    },
  ];

  validate(input) {
    let code_in_lexems = input
      .replace(/\s+/g, " ")
      .replace(/(:|{|}|,|\(|\)|;|>|<|==|=|!=|\+\+|--|"|“|”|'|\+)/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter((token) => token !== "");

    let result = this.check_in_grammar(code_in_lexems);
    return result;
  }

  check_in_grammar(lexems) {
    const result = [];

    for (const lexem of lexems) {
      let lexemFound = false;

      for (const rule of this.grammar) {
        if (rule.rule.test(lexem)) {
          result.push([lexem, rule.type, rule.description, true]);
          lexemFound = true;
          break;
        }
      }

      if (!lexemFound) {
        result.push([lexem, "Unknown", "Sin coincidencia", false]);
      }
    }

    return result;
  }
}

export default function stack(inputString) {
  const automata = new Validator();
  const result = automata.validate(inputString);
  return result;
}
