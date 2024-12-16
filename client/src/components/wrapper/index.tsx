import type { FC, PropsWithChildren } from 'react'

import './wrapper.style.css'

type Props = PropsWithChildren<{
    title?: string
    description?: string
    className?: string
}>

const Wrapper: FC<Props> = ({
    title,
    description,
    className = '',
    children
}) => (
    <div className={`wrapper ${className}`}>
        { title && <div className="title">{title}</div> }
        { description && <div className="description">{description}</div> }
        {
            children &&
            <div className="container">
                { children }
            </div>
        }
    </div>
)

export default Wrapper
