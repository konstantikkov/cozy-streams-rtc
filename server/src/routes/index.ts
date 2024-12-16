import { Router } from 'express'

import authorize from '../middleware/authorize'
import validate from '../middleware/validate'

import authentication from './authentication'
import meeting from './meeting'

const router = Router()

router.use('/authentication', validate, authentication)
router.use('/meeting', authorize, meeting.router)

export default router
