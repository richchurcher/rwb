// Converters for Knex config. Note: CommonJS.

module.exports = {
  // Convert to snake_case.
  // Won't handle some cases, like strings that begin with uppercase or consist
  // entirely of caps. Works for 'normal' column names
  camelToSnake: identifier =>
    // Match any uppercase letter `X`, replace with `_x`
    identifier.replace(/([A-Z])/g, match => `_${match[0].toLowerCase()}`),

  // Convert to camelCase.
  // This has some limitations compared to, say, Lodash
  // (https://github.com/lodash/lodash/blob/master/camelCase.js) because it
  // doesn't handle some edge cases. For example, `CAPITAL_LETTERS` becomes
  // `CAPITALLETTERS` and not `capitalLetters`. For db column identifiers it
  // ought to do the trick though.
  snakeToCamel: row => {
    // Sometimes Knex can return a single integer or something that isn't a JS object
    if (typeof row !== 'object' || row === null) return

    return Object.keys(row).reduce((accumulator, identifier) => {
      // Adjust the second character of each match to uppercase, so for example
      // `_x` becomes `X`
      const newI = identifier.replace(/_\w/g, match => match[1].toUpperCase())
      accumulator[newI] = row[identifier]
      return accumulator
    }, {})
  }
}
