import { type FC, useCallback } from 'react'
import { useForm, type FieldValues } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axios, { type AxiosError } from 'axios'

import type { ValidationResponse } from '../../types/common'
import Wrapper from '../../components/wrapper'
import Button from '../../components/button'
import Field from '../../components/field'
import Alert, { showAlert } from '../../components/alert'

import './auth.style.css'

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

    if(errorMessage) {
        showAlert(errorMessage, 'error', '/assets/info.svg')
    }

    const onSubmit = useCallback(async (data: FieldValues) => {
        await authorize(data as Fields)
    }, [authorize])

    return (
        <>
            <Alert />
            <Wrapper
            className="center-container-wrapper auth-container-wrapper"
            >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="auth-form"
            >
                <Field
                    id="username"
                    type="text"
                    placeholder="Никнейм"
                    register={register}
                    className="auth-field"
                />
                <Field
                    id="password"
                    type="password"
                    placeholder="Пароль"
                    register={register}
                    className="auth-field"
                />
                <Button
                    title="Авторизоваться"
                    className="base-action-button auth-button"
                />
            </form>
            </Wrapper>

        </>
    )
}

export default Authentication
