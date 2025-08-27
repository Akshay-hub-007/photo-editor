import { Button } from '@/components/ui/button';
import UpgradeModal from '@/components/upgrademodal';
import useCanvas from '@/context/context';
import { usePlanAccess } from '@/hooks/use-plan-access';
import { ArrowLeft, Crop, Expand, Eye, Lock, Maximize2, Palette, RotateCcw, RotateCw, Sliders, Text } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const TOOLS = [
    {
        id: "resize",
        label: "Resize",
        icon: Expand,
        isActive: true,
    },
    {
        id: "crop",
        label: "Crop",
        icon: Crop,
    },
    {
        id: "adjust",
        label: "Adjust",
        icon: Sliders,
    },
    {
        id: "text",
        label: "Text",
        icon: Text,
    },
    {
        id: "background",
        label: "AI Background",
        icon: Palette,
        proOnly: true,
    },
    {
        id: "ai_extender",
        label: "AI Image Extender",
        icon: Maximize2,
        proOnly: true,
    },
    {
        id: "ai_edit",
        label: "AI Editing",
        icon: Eye,
        proOnly: true,
    },
];

const EXPORT_FORMATS = [
    {
        format: "PNG",
        quality: 1.0,
        label: "PNG (High Quality)",
        extension: "png",
    },
    {
        format: "JPEG",
        quality: 0.9,
        label: "JPEG (90% Quality)",
        extension: "jpg",
    },
    {
        format: "JPEG",
        quality: 0.8,
        label: "JPEG (80% Quality)",
        extension: "jpg",
    },
    {
        format: "WEBP",
        quality: 0.9,
        label: "WebP (90% Quality)",
        extension: "webp",
    },
];

function EditorTopBar({
    project
}) {



    const router = useRouter()
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [restrictedtool, setRestrictedTool] = useState(null)
    const { hasAccess, canExport, isFree } = usePlanAccess();

    const { activeTool, onToolChange, canvasEditor } = useCanvas()

    const handleBackTODashBoard = () => {
        router.push("/dashboard")
    }
    const handleToolChange=(toolId)=>{
        if(!hasAccess(toolId))
        {
            setRestrictedTool(toolId)
            setShowUpgradeModal(true)
            return  
        }

        onToolChange(toolId)
    }
    return (
        <div className='border-b'>
            <div>
                <Button variant="ghost"
                    size={'sm'}
                    onClick={handleBackTODashBoard}
                    className="text-white hover:text-gray-300"
                >
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    All Projects
                </Button>
                <h1 className='font-extrabold capitalize'>{project.title}</h1>
            </div>
            <div>Right Arrow</div>

            <div className='flex items-center justify-between'>
                <div className='flex items-center  gap-2'>
                    {
                        TOOLS.map((tool) => {
                            const Icon = tool.icon
                            const isActive = activeTool == tool.id
                            const hasToolAccess = hasAccess(tool.id)
                            return <Button
                                key={tool.id}
                                variant={isActive ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleToolChange(tool.id)}
                                className={`gap-2 relative ${isActive
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "text-white hover:text-gray-300 hover:bg-gray-100"
                                    } ${!hasToolAccess ? "opacity-60" : ""}`}
                            >
                                <Icon className="h-4 w-4" />
                                {tool.label}
                                {tool.proOnly && !hasToolAccess && (
                                    <Lock className="h-3 w-3 text-amber-400" />
                                )}
                            </Button>
                        })
                    }
                </div>
                <div className="flex items-center gap-4">
                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            // className={`text-white ${!canUndo ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700"}`}
                            // onClick={handleUndo}
                            // disabled={!canUndo || isUndoRedoOperation}
                            // title={`Undo (${undoStack.length - 1} actions available)`}
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            // className={`text-white ${!canRedo ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700"}`}
                            // onClick={handleRedo}
                            // disabled={!canRedo || isUndoRedoOperation}
                            // title={`Redo (${redoStack.length} actions available)`}
                        >
                            <RotateCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

            </div>
            <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={()=>{
                setShowUpgradeModal(false)
                setRestrictedTool(false)
            }}
            restrictedTool={restrictedtool}
            reason={
                restrictedtool==="export"?
                "Free Plan is limited  to 20 expoets  per month.Upgrade to Pro for Unlimited exports":undefined
            }
            />
        </div>
    )
}


export default EditorTopBar
