import express from 'express'
import path from 'path'

import auth from './auth'
import db from './db'
import errorHandler from './error-handler'
import users from './users'

const server = express()

// Knex instance
server.set('db', db)

// Parse incoming JSON
server.use(express.json())

// Serve static files from the `public` directory
if (process.env.NODE_ENV === 'production') {
  server.use(express.static(path.join(__dirname, 'public')))
}

// Routers
server.use('/auth', auth)
server.use('/users', users)

// Send some sensible responses to errors
server.use(errorHandler)

// In production, serve any request not covered by the above as `index.html`
if (process.env.NODE_ENV === 'production') {
  server.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, 'public/index.html'))
  })
}

export default server
