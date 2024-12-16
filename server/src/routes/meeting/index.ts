import { Router } from 'express'

import prisma from '../../utils/db'
import createMeetingServer from './meeting'

const {
    meetingPool,
    createMeeting,
    startMeetingServer
} = createMeetingServer()

const router = Router()

router
    .post('/create', async (req, res) => {
        const { id } = await prisma.stream.create({ data: {} })
        createMeeting(id)

        res.json({ id })
    })
    .post('/join', async (req, res) => {
        const { id } = req.body || {}
        const isMeeting = !!meetingPool[id]

        if (isMeeting) {
            return res.json({ id })
        }

        return res.status(400).json({
            type: 'error',
            message: 'Встречи с таким идентификатором не существует'
        })
    })

export default {
    router,
    startMeetingServer
}

