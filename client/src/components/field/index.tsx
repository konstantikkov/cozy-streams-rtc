import type { FC } from 'react'
import { UseFormRegister, type FieldValues } from 'react-hook-form'

import './field.style.css'

type Props = {
    id: string
    register: UseFormRegister<FieldValues>
    placeholder?: string
    initialValue?: string
    type?: string
    className?: string
}

const Field: FC<Props> = ({
    id,
    register,
    type,
    initialValue,
    placeholder,
    className = ''
}) => (
    <input
        type={type}
        placeholder={placeholder}
        className={`field ${className}`}
        {...register(id, { value: initialValue })}
    />
)

export default Field
