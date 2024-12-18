import type { FC, PropsWithChildren } from 'react'

import './wrapper.style.css'

type Props = PropsWithChildren<{
    title?: string
    description?: string
    className?: string
    containerClassName?: string
}>

const Wrapper: FC<Props> = ({
    title,
    description,
    className = '',
    children,
    containerClassName,
}) => (
    (!!title || !!description) ? 
    <div className={`wrapper ${className}`}>
        { title && <div className={`${className}-title`}>{title}</div> }
        { description && <div className="description">{description}</div> }
        {
            children &&
            <div className={`container${containerClassName}`}>
                { children }
            </div>
        }
    </div> 
    :
    <div className={`wrapper ${className}`}>
        { title && <div className={`${className}-title`}>{title}</div> }
        { description && <div className="description">{description}</div> }
        { children }
    </div>
)

export default WrapperTitle