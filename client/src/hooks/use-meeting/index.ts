import { type MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'

import type { Answer, Connections, Offer, SendData } from '../use-media'

const MEETING_API = import.meta.env.VITE_BASE_MEETING_URL
const MEETIND_ID = 'id'
const COOKIE_TOKEN = 'token'

type Message = {
    event: string
    data: any
}

type User = RTCSessionDescriptionInit & {
    id: string
    username: string
    status: string
}

type MeetingState = {
    users: Array<User>
}

const initialMeeting: MeetingState = {
    users: []
}

const useMeeting = (id: string, connections: MutableRefObject<Connections>, setOffer: Offer, setAnswer: Answer) => {
    const socketRef = useRef<WebSocket>()
    const [meeting, setMeeting] = useState<MeetingState>(initialMeeting)

    const sendData: SendData = useCallback(async (id, event, data) => {
        // @ts-ignore
        data.id = id
        if (socketRef.current?.readyState === socketRef.current?.OPEN) {
            socketRef.current?.send(JSON.stringify({
                event,
                data
            }))
        }
    }, [socketRef.current])

    useEffect(() => {
        const meetingUrl = new URL(MEETING_API)
        meetingUrl.searchParams.append(MEETIND_ID, id)
        meetingUrl.searchParams.append(COOKIE_TOKEN, window.localStorage.getItem(COOKIE_TOKEN) || '')

        const socket = new WebSocket(meetingUrl)
        socket.onopen = () => {
            setTimeout(() => {
                socket.send(JSON.stringify({ event: 'connect' }))
            }, 500)
        }

        socket.onmessage = async (ev) => {
            const { event, data } = JSON.parse(ev.data) as Message

            switch (event) {
                case 'user': {
                    return setMeeting((meeting) => ({
                        ...meeting,
                        users: data as Array<User>
                    }))
                }
                case 'ice': {
                    const { id, ...ice } = data as RTCIceCandidateInit & { id: string }
                    await connections.current[id].addIceCandidate(ice)
                    return void 0
                }
                case 'offer': {
                    const { id, ...offer } = data as RTCSessionDescriptionInit & { id: string }
                    await setAnswer(id, sendData, offer)
                    return void 0
                }
                case 'answer': {
                    const { id, ...answer } = data as RTCSessionDescriptionInit & { id: string }
                    await connections.current[id].setRemoteDescription(answer)
                    return void 0
                }
            }
        }

        socketRef.current = socket
    }, [connections, id, setOffer, setAnswer])

    useEffect(() => {
        meeting.users.forEach(({ id, status }) => {
            if (status === 'new' && !connections.current[id]) {
                void setOffer(id, sendData)
            }
        })
    }, [connections, meeting.users, setOffer, sendData])

    console.log(connections.current)

    return meeting
}

export default useMeeting
