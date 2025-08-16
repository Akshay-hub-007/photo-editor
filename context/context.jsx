import React from 'react'
import { useContext,createContext } from 'react'

export const CanvasContext=createContext()

function useCanvas() {
     const context=useContext(CanvasContext)

     if(!context)
     {
        throw new Error("Error")
     }

     return context
}

export default useCanvas
