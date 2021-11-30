import React, {createContext, useContext, useReducer} from 'react'

const ModalStateContext = createContext(null)
const ModalDispatch = createContext(null)

type ModalStyleType = 'is-warning' | 'is-success' | 'is-danger' | 'is-dark'
export type ActionType = {
    type: 'SHOW' | 'HIDE',
    payload?: {
        header:string, 
        content:string,
        style:ModalStyleType
    }
}


type State = {
    show: boolean,
    header?:string,
    content?: string,
    style?: ModalStyleType
}
 
const modalReducer = (state: State, action: ActionType ) => {
    switch (action.type) {
        case 'SHOW':
            if (!action.payload.header ?? !action.payload.content ){
             throw new Error("Must Pass a payload with a header and content");
            }
            return {
                ...state,
                show:true,
                header:action.payload.header, 
                content: action.payload.content,
                style:action.payload.style
            }
        case 'HIDE':
            return ({...state, show:false})
    
        default:
            throw new Error(`Incorect action type. Received action: ${action.type} `);
        
    }
}

export function ModalProvider({children}) {    
    const init:State = {
        show: false,
        style: 'is-dark',
        header: '',
        content: '',
    }
    const [state, dispatch] = useReducer(modalReducer, init)

  return (
      <ModalStateContext.Provider value={state} >
        <ModalDispatch.Provider value={dispatch}>
            {children}
        </ModalDispatch.Provider>
    </ModalStateContext.Provider>
)}

/**
 * @returns Modal context. Example `const ModalState = useModalState()`
 */
export function useModalState() {
    const context = useContext(ModalStateContext)
    if (context === undefined) {
        throw new Error("useModalState must be used within a ModalProvider");   
    }
    return context
}

/**
 * @returns Modal dispatch function. Example `const ModalDispatch = useModalDispatch()`
 * Example usage: `ModalDispatch({type:'SHOW, payload:{header:'YO', content:'Text goes here'}})`
 */
export function useModalDispatch() {
    const context = useContext(ModalDispatch)
    if (context === undefined) {
        throw new Error("useModalDispatch must be used within a ModalProvider");   
    }
    return context
}
