import {
    createElement,
    type FC,
    type ButtonHTMLAttributes,
    type AnchorHTMLAttributes
} from 'react'
import { Link } from 'react-router-dom'

import './button.style.css'

export type Props = Partial<ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>> & {
    title?: string
    icon?: string
    className?: string
    style?: {
        [key: string]: string | number
    }
    to?: string
    onClick?: () => void
}

const NativeButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => createElement('button', props)

const Button: FC<Props> = ({
    title,
    icon,
    onClick,
    to = '',
    className,
    ...props
}) => {
    const isLink = !!to

    const Component = isLink ? Link : NativeButton

    return (
        <Component
            className={className}
            {...{ to, onClick }}
            {...props}
            style={{
                ...props.style
            }}
        >
            {icon && <img className='icon' src={icon} alt={icon} />}
            {title && <div className='title'>{title}</div>}
        </Component>
    )
}

export default Button
