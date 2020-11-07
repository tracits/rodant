import React from 'react'
import {useModalState} from '.'

export const Modal = () => {
    const modalState = useModalState()
    return (
        <>
        <div className={modalState ? `modal is-active` : `modal`}>
            <div className="modal-background">
            Background
            </div>
            <div className="modal-content">
            Woot woot
            </div>
            <button className="modal-close is-large" aria-label="close">X</button>
        </div>
        </>
    )
}
