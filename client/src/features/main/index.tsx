import { type FC, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type FieldValues } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import type { ValidationResponse } from '../../types/common'
import Wrapper from '../../components/wrapper'
import Button from '../../components/button'
import Field from '../../components/field'
import Alert, { showAlert } from '../../components/alert'

import './main.style.css'

type Fields = {
    id: string
}

type MeetingData = {
    id: string
}

type Props = {
    username: string
    logout: () => void
}

const Main: FC<Props> = ({ username, logout }) => {
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm<FieldValues>()
    const {
        mutate: join,
        status
    } = useMutation({
        mutationFn: (data: Fields) =>
            axios.post<ValidationResponse & MeetingData>(
                `${import.meta.env.VITE_BASE_API_URL}/api/meeting/join`,
                data,
                { withCredentials: true }
            ),
        onSuccess: (data) => {
            navigate(`/meeting/${data?.data?.id}`)
        }
    })

    const { mutate: create } = useMutation({
        mutationFn: () =>
            axios.post<ValidationResponse & MeetingData>(
                `${import.meta.env.VITE_BASE_API_URL}/api/meeting/create`,
                {},
                { withCredentials: true }
            ),
        onSuccess: (data) => {
            navigate(`/meeting/${data?.data?.id}`)
        }
    })

    const onCreate = useCallback(() => {
        create()
    }, [join])

    const onJoin = useCallback((data: FieldValues) => {
        join(data as Fields)
    }, [join])

    useEffect(() => {
        if (status == 'error') {
            showAlert('Произошла какая-то ошибка', 'error')
        }
    }, [status])

    return (
        <>
        <Alert />
        <Wrapper
            className="main-screen-header"
        >
            <div className="header-username">
                {username}
            </div>
            <Button
                className="header-button"
                icon="/assets/logout.png"
                onClick={logout}
            />
        </Wrapper>
        <Wrapper
            className='center-container-wrapper main-container-wrapper'
        >
            <Wrapper
            className="conference-form-wrapper"
            title="Подключиться"
            >
            <form
                className="join-conference-form"
                onSubmit={handleSubmit(onJoin)}
            >
                <Field
                    id="id"
                    type="text"
                    placeholder="id конференции"
                    register={register}
                    className="conference-id-field"
                />
                <Button
                    title="Подключиться"
                    className="base-action-button join-conference-button"
                />
            </form>
            </Wrapper>
            <Wrapper
                className="conference-form-wrapper"
                title="Создать новую конференцию"
            >
                <Button
                    title="Создать"
                    onClick={onCreate}
                    className="base-action-button create-conference-button"
                />
            </Wrapper>
        </Wrapper>
        </>
    )
}

export default Main
