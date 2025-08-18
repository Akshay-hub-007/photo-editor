import useCanvas from '@/context/context'
import { api } from '@/convex/_generated/api'
import { useConvexMutation } from '@/hooks/useConvexQuery'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, FabricImage } from "fabric"
function CanvasEditor({ project }) {
    const [isLoading, setIsLoading] = useState(true)

    const canvasRef = useRef()
    const containerRef = useRef()

    const { canvasEditor, setCanvasEditor, activeTool, setActiveTool } = useCanvas()

    const { mutate: updateProject } = useConvexMutation(api.projects.updateProject)

    const calculateViewPortScale = () => {
        if (!containerRef.current || !project) return;

        const container = containerRef.current
        const containerWidth = containerRef.clientWidth - 40
        const containerHeight = containerRef.clientHeight - 40

        const scaleX = containerWidth / project.width
        const scaleY = containerHeight / project.height

        return Math.min(scaleX, scaleY, 1);
    }

    useEffect(() => {
        // Always dispose previous canvas before initializing a new one
        if (canvasEditor) {
            canvasEditor.dispose();
            setCanvasEditor(null);
        }
        if (!canvasRef.current || !project) return;

        const initializeCanvas = async () => {
            setIsLoading(true)
            const viewportScale = calculateViewPortScale()

            const canvas = new Canvas(canvasRef.current, {
                width: project.width,
                height: project.height,
                backgroudColor: "#ffffff",
                preserveObjectStacking: true,
                controlsAboveOverlay: true,
                selection: true,
                hoverCursor: "move",
                moveCursor: "move",
                defaultCursor: "move",
                allowTouchScrolling: false,
                renderOnAddRemove: true,
                skipTargetFind: false
            })

            canvas.setDimensions({
                width: project.width * viewportScale,
                height: project.height * viewportScale
            }, { backstoreOnly: false })

            canvas.setZoom(viewportScale)

            const scaleFactor = window.devicePixelRatio || 1

            if (scaleFactor > 1) {
                canvas.getElement().width = project.width * scaleFactor
                canvas.getElement().height = project.height * scaleFactor
                canvas.getContext().scale(scaleFactor, scaleFactor)
            }

            if (project.currrentImageUrl || project.originalImage) {
                try {
                    const imageurl = project.currrentImageUrl || project.originalImage
                    const fabricImage = new FabricImage.fromURL(imageurl, {
                        crossOrigin: "anonymous"
                    })
                    const imgAspectRatio = fabricImage.width / fabricImage.height
                    const canvasAspectRatio = project.width / project.height
                    let scaleX, scaleY;
                    if (imgAspectRatio > canvasAspectRatio) {
                        scaleX = project.width / fabricImage.width
                        scaleY = scaleX
                    } else {
                        scaleY = project.height / fabricImage.height
                        scaleX = scaleY
                    }
                    fabricImage.set({
                        left: project.width,
                        top: project.height,
                        originX: "center",
                        originY: "center",
                        scaleX,
                        scaleY,
                        selectable: true,
                        evented: true
                    })
                    canvas.add(fabricImage)
                    canvas.centerObject(fabricImage)
                } catch (error) {
                    console.log("Error in loading the project" + error)
                }
            }
            // Load saved canvas state
            if (project.canvasState) {
                try {
                    await canvas.loadFromJSON(project.canvasState);
                    canvas.requestRenderAll();
                } catch (error) {
                    console.error("Error loading canvas state:", error);
                }
            }
            canvas.calcOffset();
            canvas.requestRenderAll();
            setCanvasEditor(canvas);
            setTimeout(() => {
                // workaround for initial resize issues
                window.dispatchEvent(new Event("resize"));
            }, 500);
            setIsLoading(false);
        };
        initializeCanvas();
        // Cleanup function
        return () => {
            if (canvasEditor) {
                canvasEditor.dispose();
                setCanvasEditor(null);
            }
        };
    }, [project])
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

export default CanvasEditor
