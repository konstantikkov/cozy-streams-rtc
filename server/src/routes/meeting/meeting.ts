import { type Server } from 'http'
import WebSocket from 'ws'
import jwt from 'jsonwebtoken'

import prisma from '../../utils/db'

type User = Partial<RTCSessionDescriptionInit> & {
    id: string
    username?: string
    ws: WebSocket
    status: string
}

type Meeting = {
    id: string
    users: Record<string, User>
}

type Event = {
    event: string
    data: any
}

const createMeetingServer = () => {
    const meetingPool: Record<string, Meeting> = {}

    const createMeeting = (id: string) => {
        meetingPool[id] = {
            id,
            users: {}
        }
    }

    const startMeetingServer = (server: Server) => {
        const meetingServer = new WebSocket.Server({
            server: server as unknown as Server
        })

        meetingServer.on('connection', async (ws, req) => {
            try {
                const params = new URLSearchParams(req.url?.split('?')[1])
                const id = params.get('id') || ''
                const token = params.get('token') || ''

                if (!meetingPool[id]) {
                    ws.close(1001)
                }
                
                // @ts-ignore
                const { userId } = (token && jwt.verify(token, process.env.JWT_SECRET)) as { userId: string }

                const user = await prisma.user.findFirst({
                    where: {
                        id: userId
                    }
                })

                if (user) {
                    meetingPool[id].users[userId] = {
                        id: userId,
                        username: user.username,
                        ws,
                        status: 'new'
                    }

                    ws.on('message', (message) => {
                        const { event, data } = JSON.parse(String(message)) as Event
                        switch (event) {
                            case 'offer':
                            case 'answer':
                            case 'ice': {
                                const { id: remoteUserId, ...sdpData } = data
                                return meetingPool[id].users[remoteUserId].ws.send(JSON.stringify({
                                    event,
                                    data: {
                                        id: userId,
                                        ...sdpData
                                    }
                                }))
                            }
                            case 'connect': {
                                const users = Object.values(meetingPool[id].users)

                                users.forEach(({ id: userId, ws }, index) => {
                                    const message = JSON.stringify({
                                        event: 'user',
                                        data: users.reduce<Array<Omit<User, 'ws'>>>(
                                            (prev, { id, username, status }) => {
                                                if (id !== userId) {
                                                    prev.push({
                                                        id,
                                                        username,
                                                        status
                                                    })
                                                }
                                                return prev
                                        }, [])
                                    })

                                    if (ws.readyState === ws.OPEN) {
                                        ws.send(message)
                                    }
                                })

                                return meetingPool[id].users[userId].status = 'updated'
                            }
                        }
                    })
                }
            } catch (e) {
                console.log(e)
                ws.close()
            }
        })

        return meetingServer
    }

    return ({
        meetingPool,
        createMeeting,
        startMeetingServer
    })
}

export default createMeetingServer
