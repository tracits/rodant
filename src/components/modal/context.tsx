
import React, {createContext, useContext, useReducer} from 'react'

const ModalStateContext = createContext(null)
const ModalDispatch = createContext(null)

const modalReducer = (state, action ) => {
    switch (action.type) {
        case 'SHOW':
            return state
        case 'HIDE':
            return state
    
        default:
            throw new Error(`Incorect action type. Received action: ${action.type} `);
        
    }
}


export function ModalProvider({children}) {
    const [state, dispatch] = useReducer(modalReducer, false)

  return (
      <ModalStateContext.Provider value={state} >
        <ModalDispatch.Provider value={dispatch}>
            {children}
        </ModalDispatch.Provider>
    </ModalStateContext.Provider>
)}

export function useModalState() {
    const context = useContext(ModalStateContext)
    if (context === undefined) {
        throw new Error("useModalState must be used within a ModalProvider");   
    }
    return context
}

export function useModalDispatch() {
    const context = useContext(ModalDispatch)
    if (context === undefined) {
        throw new Error("useModalDispatch must be used within a ModalProvider");   
    }
    return context
}
