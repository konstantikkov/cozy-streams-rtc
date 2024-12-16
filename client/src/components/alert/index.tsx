import type { FC } from 'react'

import './alert.style.css'

type Props = {
    title?: string
    icon?: string
    className?: string
}

const Alert: FC<Props> = ({ title, icon, className }) => {
    return (
        <div className={`alert ${className}`}>
            { icon && <img className="icon" src={icon} /> }
            { title && <div className="title">{title}</div> }
        </div>
    )
}

export default Alert
