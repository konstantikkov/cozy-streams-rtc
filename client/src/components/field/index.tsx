import type { FC } from 'react'
import { UseFormRegister, type FieldValues } from 'react-hook-form'

import './field.style.css'

type Props = {
    id: string
    label?: string
    register: UseFormRegister<FieldValues>
    placeholder?: string
    icon?: string
    initialValue?: string
    type?: string
}

const Field: FC<Props> = ({
    id,
    register,
    type,
    label,
    icon,
    initialValue,
    placeholder
}) => (
    <div className="field">
        { label && <div className="label">{label}</div> }
        { icon && <img className="icon" src={icon} /> }
        <input
            type={type}
            placeholder={placeholder}
            {...register(id, { value: initialValue })}
        />
    </div>
)

export default Field
