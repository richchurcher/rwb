import converters from './knex-converters'

test("camelToSnake: 'aB'", () => {
  expect(converters.camelToSnake('aB')).toBe('a_b')
})

test("camelToSnake: 'thisWombatIsACutie'", () => {
  expect(converters.camelToSnake('thisWombatIsACutie')).toBe('this_wombat_is_a_cutie')
})

test("snakeToCamel: 'a_b'", () => {
  const expected = { aB: 'foo' }
  const actual = converters.snakeToCamel({ a_b: 'foo' })
  expect(actual).toEqual(expected)
})

test("snakeToCamel: 'this_wombat_is_a_cutie'", () => {
  const expected = { thisWombatIsACutie: 'flargle' }
  const actual = converters.snakeToCamel({ this_wombat_is_a_cutie: 'flargle' })
  expect(actual).toEqual(expected)
})
