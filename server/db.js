import knex from 'knex'
import knexfile from './knexfile'

// Rarely, NODE_ENV may be undefined
const config = knexfile[process.NODE_ENV || 'development']
export default knex(config)
