import useCanvas from '@/context/context'
import { api } from '@/convex/_generated/api'
import { useConvexMutation } from '@/hooks/useConvexQuery'
import React, { useRef, useState } from 'react'

function Canvas({project}) {
    const [isLoading, setIsLoading] = useState(true)

    const canvasRef = useRef()
    const containerRef = useRef()

    const { canvasEditor, setCanvasEditor, activeTool, setActiveTool } = useCanvas()

    const { mutate: updateProject } = useConvexMutation(api.projects.updateProject)

    const calculateViewPortScale=()=>{
        if(!containerRef.current || !project) return;

        const container=containerRef.current 
        const containerWidth=containerRef.clientWidth-40 
        const containerHeight=containerRef.clientHeight-40 

        const scaleX=containerWidth/project.width 
        const scaleY=containerHeight/project.height

        return Math.min(scaleX,scaleY,1);
    }
    return (
        <div ref={containerRef} className="relative flex items-center justify-center bg-secondary w-full h-full overflow-hidden">
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
            />
            <div className='px-5'>

                <canvas d="canvas" ref={canvasRef} className='border' />
            </div>
        </div>
    )
}

export default Canvas
