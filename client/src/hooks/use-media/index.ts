import { createRef, RefObject, useState, useCallback, useRef } from 'react'

import { ICE_SERVERS, constraints } from './constants'

type Source = keyof typeof constraints

const getMediaStream = async (source: Source) => {
    const mediaSources = await navigator.mediaDevices
    switch (source) {
        case 'video':
            return mediaSources.getUserMedia(constraints.video)
        case 'audio':
            return mediaSources.getUserMedia(constraints.audio)
    }
}

export type Connections = Record<string, RTCPeerConnection>


export type SendData = (id: string, event: string, data: RTCSessionDescriptionInit | RTCIceCandidate) => void
export type Offer = (id: string, sendData: SendData) => Promise<void>
export type Answer = (id: string, sendData: SendData, offer: RTCSessionDescriptionInit) => Promise<void>

const useMedia = () => {
    const connections = useRef<Connections>({})
    const [media, setMedia] = useState<Record<string, RefObject<HTMLVideoElement>>>({
        self: createRef<HTMLVideoElement>()
    })

    const onTrack = useCallback((id: string) => {
        connections.current[id].ontrack = ({ streams: [remoteStream] }) => {
            const ref = createRef<HTMLVideoElement>()
            setMedia((media) => ({
                ...media,
                [id]: ref
            }))
            if (ref.current) {
                ref.current.srcObject = remoteStream
            }
        }
    }, [connections, setMedia])

    const offer: Offer = useCallback(async (id, sendData) => {
        connections.current[id] = new RTCPeerConnection({
            iceServers: ICE_SERVERS
        })
        connections.current[id].createDataChannel('test')

        // connections.current[id].onicecandidate = async (event) => {
        //     console.log(event)
        //     if (event.candidate) {
        //         sendData(id, 'ice', event.candidate)
        //     }
        // }

        const offer = await connections.current[id].createOffer()
        await connections.current[id].setLocalDescription(offer)

        await sendData(id, 'offer', offer)
        onTrack(id)
    }, [onTrack, connections])

    const answer: Answer = useCallback(async (id, sendData, offer) => {
        connections.current[id] = new RTCPeerConnection({ iceServers: ICE_SERVERS })

        connections.current[id].ondatachannel = () => {
            console.log('datachannel')
        }

        await connections.current[id].setRemoteDescription(offer)

        // connections.current[id].onicecandidate = async (event) => {
        //     if (event.candidate) {
        //         sendData(id, 'ice', event.candidate)
        //     }
        // }

        const answer = await connections.current[id].createAnswer()
        await connections.current[id].setLocalDescription(answer)
        // onTrack(id)

        sendData(id, 'answer', answer)
    }, [onTrack, connections])

    const share = useCallback(async (source: Source) => {
        const inputSource = await getMediaStream(source)

        if (media.self.current) {
            if (!media.self.current.srcObject) {
                media.self.current.srcObject = new MediaStream()
            }
            const mediaStream = media?.self?.current?.srcObject as MediaStream
            switch (source) {
                case 'audio': {
                    const audioTrack = mediaStream?.getAudioTracks()?.[0] || inputSource.getAudioTracks()?.[0]

                    if (!!(mediaStream?.getAudioTracks()?.length)) {
                        mediaStream.removeTrack(audioTrack)
                    } else {
                        (media.self.current.srcObject as MediaStream).addTrack(audioTrack)
                    }
                    break
                }
                case 'video': {
                    const videoTrack = mediaStream?.getVideoTracks()?.[0] || inputSource.getVideoTracks()?.[0]

                    if (!!(mediaStream?.getVideoTracks()?.length)) {
                        mediaStream.removeTrack(videoTrack)
                    } else {
                        (media.self.current.srcObject as MediaStream).addTrack(videoTrack)
                    }
                    break
                }
            }

            setMedia((media) => ({ ...media }))
        }

        inputSource.getTracks().forEach((track) => {
            Object.values(connections.current).forEach((connection) => {
                console.log(connection)
                connection.addTrack(track)
            })
        })
    }, [connections])

    const isSelfAudio = !!((media?.self?.current?.srcObject as MediaStream)?.getAudioTracks()?.length)
    const isSelfVideo = !!((media?.self?.current?.srcObject as MediaStream)?.getVideoTracks()?.length)

    return ({
        connections,
        media,
        offer,
        answer,
        share,
        isSelfAudio,
        isSelfVideo
    })
}

export default useMedia
