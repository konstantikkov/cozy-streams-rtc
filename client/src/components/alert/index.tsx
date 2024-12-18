import './alert.style.css'
import React, { useState, useEffect } from 'react'

let title: string | undefined
let status: string | undefined
let icon: string | undefined

export const showAlert = (t: string, s: string | undefined, i?: string | undefined) => {
    title = t
    status = s
    icon = i
}

const Alert: React.ElementType = () => {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!!title) {
            setShow(true)
        }
    }, [title])

    // useEffect(() => {
    //     if (show) {
    //         const timer = setTimeout(() => {
    //             setShow(false)
    //         }, 2000)
    //         return () => clearTimeout(timer)
    //     }
    // }, [show])

    return (
        show && !!title ? 
        <div className={`alert ${status}`}>
            { icon && <img className="icon" src={icon} /> }
            { title && <div className="title">{title}</div> }
        </div>
        :
        <></>
    )
}

export default Alert
