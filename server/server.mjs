import express from 'express'
import bodyParser from 'body-parser'

import auth from './auth'
import db from './db'
import errorHandler from './error-handler'
import users from './users'

const server = express()

// Knex instance
server.set('db', db)

// Parse incoming JSON
server.use(bodyParser.json())

// Routers
server.use('/auth', auth)
server.use('/users', users)

// Home
server.get('/', async (req, res) => {
  res.send('Yup.')
})

// Send some sensible responses to errors
server.use(errorHandler)

export default server
