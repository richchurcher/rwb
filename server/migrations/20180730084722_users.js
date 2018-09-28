// See knexfile and the timestamps migration for onUpdateTrigger
const { onUpdateTrigger } = require('../knexfile')

exports.up = knex => knex.schema.createTable('users', table => {
  table.increments('id').primary()
  table.string('email').unique()
  table.string('hash')
  table.string('avatar_url')
  table.string('display_name')
  table.timestamps(true, true)
})
  .then(() => knex.raw(onUpdateTrigger('users')))

exports.down = knex => knex.schema.dropTable('users')
