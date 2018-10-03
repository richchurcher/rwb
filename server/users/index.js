import express from 'express'

import { privateRoute } from '../auth/route-helpers'

const router = express.Router()

const getUser = (req, res) => {
  const { user } = res.locals
  if (user) {
    res.json(user)
  }
}

router.get('/:id', privateRoute, getUser)

export default router
