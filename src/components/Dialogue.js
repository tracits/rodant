import React from 'react'

function Dialogue({
    title,
    isDialogueActive,
    toggleDialogue,
    onConfirm
}) {
    return (
        <div className={isDialogueActive ? "modal is-active" : "modal"}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{title}</p>
                    <button onClick={toggleDialogue} className="delete" aria-label="close"></button>
                </header>
                <footer className="modal-card-foot">
                    <button onClick={onConfirm} className="button is-danger">Confirm</button>
                    <button onClick={toggleDialogue} className="button">Cancel</button>
                </footer>
            </div>
        </div>
    );
}

export default Dialogue
