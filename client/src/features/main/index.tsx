import { type FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type FieldValues } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axios, { type AxiosError } from 'axios'

import type { ValidationResponse } from '../../types/common'
import Wrapper from '../../components/wrapper'
import Button from '../../components/button'
import Field from '../../components/field'
import Alert from '../../components/alert'

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
        status,
        error
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

    const errorMessage = (error as AxiosError<ValidationResponse>)?.response?.data?.message

    return (
        <>
            <Wrapper
                className="absolute right-5 top-5 [&>.container]:!p-3"
            >
                <div className="flex items-center gap-5">
                    <div className="text-2xl">
                        {username}
                    </div>
                    <Button
                        className="square-button w-10 gray-button"
                        icon="/assets/logout.png"
                        onClick={logout}
                    />
                </div>
            </Wrapper>
            <Wrapper
                className="min-w-[600px] max-md:min-w-full mb-2"
                title="Подключайтесь"
            >
                <form
                    className="flex gap-5 [&>*]:mb-0"
                    onSubmit={handleSubmit(onJoin)}
                >
                    <Field
                        id="id"
                        type="text"
                        placeholder="id конференции"
                        register={register}
                    />
                    <Button
                        title="Подключиться"
                        className="yellow-button max-w-48 h-fit"
                    />
                </form>
            </Wrapper>
            {
                status === 'error' &&
                <Alert
                    className="min-w-[600px] max-md:min-w-full error mb-5"
                    icon="/assets/info.svg"
                    title={errorMessage || 'Что-то пошло не так'}
                />
            }
            <Wrapper
                className="min-w-[600px] max-md:min-w-full"
                title="или Создайте новую"
            >
                <Button
                    title="Создать конференцию"
                    onClick={onCreate}
                    className="yellow-button"
                />
            </Wrapper>
        </>
    )
}

export default Main
