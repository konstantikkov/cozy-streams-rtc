import { type FC, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useMeeting from '../../hooks/use-meeting'
import Wrapper from '../../components/wrapper'
import useMedia from '../../hooks/use-media'
import Button from '../../components/button'

type Props = {
    username: string
}

const Meeting: FC<Props> = ({ username }) => {
    const navigate = useNavigate()
    const { id = '' } = useParams()

    const {
        connections,
        offer,
        answer,
        media,
        share,
        isSelfAudio,
        isSelfVideo
    } = useMedia()

    console.log({ connections })

    const meeting = useMeeting(id, connections, offer, answer)

    const onDisconnect = useCallback(() => {
        navigate('/')
    }, [navigate])

    const onCopyInvite = useCallback(() => {
        navigator.clipboard.writeText(window.location.href)
    }, [navigate])

    const onShareVideo = useCallback(() => {
        share('video')
    }, [])

    const onShareAudio = useCallback(() => {
        share('audio')
    }, [])

    return (
        <>
            <div className="w-full flex flex-wrap justify-center items-center gap-5 p-5">
                {
                    meeting.users.map(({ username, id }) => (
                        <Wrapper className="min-w-44">
                            <video
                                className="w-full rounded-xl mb-3"
                                playsInline
                                autoPlay
                                ref={media[id]}
                            />
                            {username}
                        </Wrapper>
                    ))
                }
                <Wrapper className="min-w-44">
                    <video
                        className="w-full rounded-xl mb-3"
                        playsInline
                        autoPlay
                        muted
                        ref={media.self}
                    />
                    <div>{username}</div>
                </Wrapper>
            </div>
            <Wrapper className="animate-none absolute bottom-5 left-1/2 -translate-x-1/2 [&>.container]:!p-3">
                <div className="flex gap-5">
                    <Button
                        icon="/assets/camera.png"
                        className={`square-button ${isSelfVideo ? 'yellow-button' : ' gray-button'}`}
                        onClick={onShareVideo}
                    />
                    <Button
                        icon="/assets/mic.png"
                        className={`square-button ${isSelfAudio? 'yellow-button' : ' gray-button'}`}
                        onClick={onShareAudio}
                    />
                    <Button
                        icon="/assets/share.png"
                        className="square-button gray-button"
                        onClick={onCopyInvite}
                    />
                    <Button
                        title="Отключиться"
                        className="gray-button h-fit"
                        onClick={onDisconnect}
                    />
                </div>
            </Wrapper>
        </>
    )
}

export default Meeting
