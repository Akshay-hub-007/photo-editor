"use client"
import { Button } from '@/components/ui/button';
import useCanvas from '@/context/context';
import { api } from '@/convex/_generated/api';
import { useConvexMutation } from '@/hooks/useConvexQuery';
import { Unlock } from 'lucide-react';
import React from 'react'
const ASPECT_RATIOS = [
  { name: "Instagram Story", ratio: [9, 16], label: "9:16" },
  { name: "Instagram Post", ratio: [1, 1], label: "1:1" },
  { name: "Youtube Thumbnail", ratio: [16, 9], label: "16:9" },
  { name: "Portrait", ratio: [2, 3], label: "2:3" },
  { name: "Facebook Cover", ratio: [851, 315], label: "2.7:1" },
  { name: "Twitter Header", ratio: [3, 1], label: "3:1" },
];

function ResizeControls({ project }) {
  const { canvasEditor, processingMessage, setProcesssingMessage } = useCanvas()
  const [newWidth, setNewWidth] = useState(project?.width || 800);
  const [newHeight, setNewHeight] = useState(project?.height || 600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const {
    mutate: updateProject,
    data,
    isLoading
  } = useConvexMutation(api.projects.updateProject)

  if (!canvasEditor || !project) {
    return (
      <div className='p-4'>
        <p className='text-white/70 text-sm'>Canvas Not Ready</p>
      </div>
    )
  }

  const hasChanges = newWidth != project.width || newHeight != project.height
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
          onClick={()=>setLockAspectRatio(!lockAspectRatio)}
          className={"text-white/70 hover:text-white p-1"}
          >
            {
              lockAspectRatio?(
                <Lock className="h-4 w-4"/>
              ):(
                <Unlock className='h-4 w-4'/>
              )
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResizeControls
