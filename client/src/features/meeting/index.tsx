import { type FC, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useMeeting from '../../hooks/use-meeting'
import Wrapper from '../../components/wrapper'
import useMedia from '../../hooks/use-media'
import Button from '../../components/button'

import './meeting.style.css'

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
            <div className="participants-frames-grid main-video-frames-wrapper">
                {
                    meeting.users.map(({ username, id }) => (
                        <Wrapper className="participant-frame-wrapper">
                            {media[id] ? (
                                <video
                                    className="participant-video-frame video-frame"
                                    playsInline
                                    autoPlay
                                    ref={media[id]}
                                />
                            ) : (
                                <div className='participant-no-video'>
                                    <img src="/assets/person.svg" className="person-icon" />
                                </div>
                            )}
                            {username}
                        </Wrapper>
                    ))
                }
                <Wrapper className="my-video-frame-wrapper participant-frame-wrapper">
                    <video
                        className="my-video-frame video-frame"
                        playsInline
                        autoPlay
                        muted
                        ref={media.self}
                    />
                    <div>{username}</div>
                </Wrapper>
            </div>
            <Wrapper className="meeting-control-buttons-wrapper">
                <Button
                    icon="/assets/camera.png"
                    className={`meeting-control-square-button ${isSelfVideo ? 'base-action-button' : ' gray-button'}`}
                    onClick={onShareVideo}
                />
                <Button
                    icon="/assets/mic.png"
                    className={`meeting-control-square-button ${isSelfAudio? 'base-action-button' : ' gray-button'}`}
                    onClick={onShareAudio}
                />
                <Button
                    icon="/assets/share.png"
                    className="meeting-control-square-button gray-button"
                    onClick={onCopyInvite}
                />
                <Button
                    title="Отключиться"
                    className="meeting-control-exit-button h-fit"
                    onClick={onDisconnect}
                />
            </Wrapper>
        </>
    )
}

export default Meeting
