import { type FC, useCallback } from 'react'
import { useForm, type FieldValues } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axios, { type AxiosError } from 'axios'

import type { ValidationResponse } from '../../types/common'
import Wrapper from '../../components/wrapper'
import Button from '../../components/button'
import Field from '../../components/field'
import Alert from '../../components/alert'

type Fields = {
    username: string
    password: string
}

type AuthenticationData = {
    token: string
    username: string
}

type Props = {
    login: (token: string, username: string) => void
}

const Authentication: FC<Props> = ({ login }) => {
    const { register, handleSubmit } = useForm<FieldValues>()
    const {
        mutate: authorize,
        status,
        error,
        data: { data } = {},
    } = useMutation({
        mutationFn: (data: Fields) => axios.post<ValidationResponse & AuthenticationData>(`${import.meta.env.VITE_BASE_API_URL}/api/authentication`, data),
        onSuccess: (response) => {
            login(response.data.token, response.data.username)
        }
    })

    const errorMessage = (error as AxiosError<ValidationResponse>)?.response?.data?.message

    const onSubmit = useCallback(async (data: FieldValues) => {
        await authorize(data as Fields)
    }, [authorize])

    return (
        <>
            <Wrapper
                className="w-80 max-md:min-w-full"
                title="Авторизация"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Field
                        id="username"
                        type="text"
                        placeholder="Никнейм"
                        register={register}
                    />
                    <Field
                        id="password"
                        type="password"
                        placeholder="Пароль"
                        register={register}
                    />
                    <Button
                        title="Авторизоваться"
                        className="yellow-button"
                    />
                </form>
            </Wrapper>
            {
                data?.message &&
                <Alert
                    className={`w-80 max-md:min-w-full ${data?.type}`}
                    title={data?.message}
                />
            }
            {
                status === 'error' &&
                <Alert
                    title={errorMessage || 'Что-то пошло не так'}
                    className="w-80 max-md:min-w-full error"
                    icon="/assets/info.svg"
                />
            }
        </>
    )
}

export default Authentication
