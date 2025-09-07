"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCanvas from '@/context/context';
import { api } from '@/convex/_generated/api';
import { useConvexMutation } from '@/hooks/useConvexQuery';
import { Expand, Lock, Monitor, Unlock, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
const ASPECT_RATIOS = [
  { name: "Instagram Story", ratio: [9, 16], label: "9:16" },
  { name: "Instagram Post", ratio: [1, 1], label: "1:1" },
  { name: "Youtube Thumbnail", ratio: [16, 9], label: "16:9" },
  { name: "Portrait", ratio: [2, 3], label: "2:3" },
  { name: "Facebook Cover", ratio: [851, 315], label: "2.7:1" },
  { name: "Twitter Header", ratio: [3, 1], label: "3:1" },
];

function ResizeControls({ project }) {
  const { canvasEditor, processingMessage, setProcessingMessage } = useCanvas()
  const [newWidth, setNewWidth] = useState(project?.width || 800);
  const [newHeight, setNewHeight] = useState(project?.height || 600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const handleWidthChange = (value) => {
    const width = parseInt(value) || 0
    setNewWidth(width)
    if (lockAspectRatio && project) {
      const ratio = project.height / project.width;
      setNewHeight(Math.round(width * ratio))
    }
  }
  
  const handleHeightChange = (value) => {
    const height = parseInt(value) || 0;
    setNewHeight(height);

    if (lockAspectRatio && project) {
      const ratio = project.width / project.height;
      setNewWidth(Math.round(height * ratio));
    }
    setSelectedPreset(null);
  };

  const {
    mutate: updateProject,
    data,
    isLoading
  } = useConvexMutation(api.projects.updateProject)
useEffect(()=>{
    if(!isLoading && data)
    {
      setTimeout(()=>{
        window.dispatchEvent(new Event("resize"))
      },500)
    }
  },[data,isLoading])
  if (!canvasEditor || !project) {
    return (
      <div className='p-4'>
        <p className='text-white/70 text-sm'>Canvas Not Ready</p>
      </div>
    )
  }
  const calculateAspectRatioDimensions = (ratio) => {
    if (!project) return { width: project.width, height: project.height };

    const [ratioW, ratioH] = ratio;
    const originalArea = project.width * project.height;

    // Calculate new dimensions maintaining the same area approximately
    const aspectRatio = ratioW / ratioH;
    const newHeight = Math.sqrt(originalArea / aspectRatio);
    const newWidth = newHeight * aspectRatio;

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    };
  };
  const hasChanges = newWidth != project.width || newHeight != project.height

  const applyAspectRatio = (aspectRatio) => {
    const dimensions = calculateAspectRatioDimensions(aspectRatio.ratio);
    setNewWidth(dimensions.width);
    setNewHeight(dimensions.height);
    setSelectedPreset(aspectRatio.name);
  };
 const calculateViewportScale = () => {
    const container = canvasEditor.getElement().parentNode;
    if (!container) return 1;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;
    const scaleX = containerWidth / newWidth;
    const scaleY = containerHeight / newHeight;
    return Math.min(scaleX, scaleY, 1);
  };


  // Apply canvas resize
  const handleApplyResize = async () => {
    if (
      !canvasEditor ||
      !project ||
      (newWidth === project.width && newHeight === project.height)
    ) {
      return;
    }

    setProcessingMessage ("Resizing canvas...");

    try {
      // Resize the canvas
      canvasEditor.setWidth(newWidth);
      canvasEditor.setHeight(newHeight);

      // Calculate and apply viewport scale
      const viewportScale = calculateViewportScale();

      canvasEditor.setDimensions(
        {
          width: newWidth * viewportScale,
          height: newHeight * viewportScale,
        },
        { backstoreOnly: false }
      );

      canvasEditor.setZoom(viewportScale);
      canvasEditor.calcOffset();
      canvasEditor.requestRenderAll();

      // Update project in database
      await updateProject({
        projectId: project._id,
        width: newWidth,
        height: newHeight,
        canvaState: canvasEditor.toJSON(),
      });
    } catch (error) {
      console.error("Error resizing canvas:", error);
      alert("Failed to resize canvas. Please try again.");
    } finally {
      setProcessingMessage (null);
    }
  }; 

  return (
    <div className='space-y-6'>
      <div className='bg-slate-700/30 rounded-lg p-3'>
        <h4 className='text-sm font-medium text-white mb-2'>Current Size</h4>
        <div className='text-white/70 text-xs'>{project.height} x {project.width} pixels</div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-sm font-medium text-white'>Custom Size</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
            className={"text-white/70 hover:text-white p-1"}
          >
            {
              lockAspectRatio ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className='h-4 w-4' />
              )
            }
          </Button>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='text-xs text-white/70 mb-1 block'>Width</label>
            <Input
              type={"number"}
              value={newWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
              min="100"
              max="5000"
              className={'bg-slate-700 border-white/20 text-white'}
            />
          </div>
        </div>
        <div className='flex items-center  justify-between text-xs'>
          <span className='text-white/70 '>
            {lockAspectRatio ? "Aspect Ratio is Locked" : "Free resize"}
          </span>

        </div>
      </div>

      <div className='space-y-3'>
        <h3 className='text-sm font-medium text-white'>Aspect Ratios</h3>
        <div className='grid  grid-cols-1 max-h-60  overflow-y-auto  gap-2'>
          {ASPECT_RATIOS.map((aspectRatio) => {
            const dimensions = calculateAspectRatioDimensions(aspectRatio.ratio)
            const isSelected = selectedPreset === aspectRatio.name;
            return (
              <Button
                key={aspectRatio.name}
                variant={isSelected ? "default" : "ghost"}
                size={"sm"}
                onClick={() => applyAspectRatio(aspectRatio)}
                className={`justify-between h-auto py-2 ${isSelected ? "bg-cyan-500 hover:bg-cyan-600" : "bg-slate-700 hover:bg-slate-800 text-white"
                  }`}
              >
                <div>
                  <div className='font-medium'>{aspectRatio.name}</div>
                  <div className='text-xs opacity-70'>
                    {dimensions.width} x {dimensions.height} {aspectRatio.label}
                  </div>
                </div>
                <Monitor className='h-4 w-4' />
              </Button>
            )
          })}
        </div>
      </div>
      {hasChanges && (
        <div className="bg-slate-700/30 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2">
            New Size Preview
          </h4>
          <div className="text-xs text-white/70">
            <div>
              New Canvas: {newWidth} × {newHeight} pixels
            </div>
            <div className="text-cyan-400">
              {newWidth > project.width || newHeight > project.height
                ? "Canvas will be expanded"
                : "Canvas will be cropped"}
            </div>
            <div className="text-white/50 mt-1">
              Objects will maintain their current size and position
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      <Button
        onClick={handleApplyResize}
        disabled={!hasChanges || processingMessage}
        className="w-full"
        variant="primary"
      >
        <Expand className="h-4 w-4 mr-2" />
        Apply Resize
      </Button>

      {/* Instructions */}
      <div className="bg-slate-700/30 rounded-lg p-3">
        <p className="text-xs text-white/70">
          <strong>Resize Canvas:</strong> Changes canvas dimensions.
          <br />
          <strong>Aspect Ratios:</strong> Smart sizing based on your current
          canvas.
          <br />
          Objects maintain their size and position.
        </p>
      </div>
    </div>
  )
}

export default ResizeControls
