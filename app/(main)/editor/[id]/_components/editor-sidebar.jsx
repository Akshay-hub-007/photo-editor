import { Button } from '@/components/ui/button';
import useCanvas from '@/context/context';
import { ArrowLeft, Crop, Expand, Eye, Maximize2, Palette, Sliders, Text } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import CropContent from './_tools/crop';
import ResizeControls from './_tools/resize';
import AdjustControls from './_tools/adjust';
import BackgroundControls from './_tools/ai-background';


  const TOOL_CONFIGS = {
    resize: {
      title: "Resize",
      icon: Expand,
      description: "Change project dimensions",
    },
    crop: {
      title: "Crop",
      icon: Crop,
      description: "Crop and trim your image",
    },
    adjust: {
      title: "Adjust",
      icon: Sliders,
      description: "Brightness, contrast, and more (Manual saving required)",
    },
    background: {
      title: "Background",
      icon: Palette,
      description: "Remove or change background",
    },
    ai_extender: {
      title: "AI Image Extender",
      icon: Maximize2,
      description: "Extend image boundaries with AI",
    },
    text: {
      title: "Add Text",
      icon: Text,
      description: "Customize in Various Fonts",
    },
    ai_edit: {
      title: "AI Editing",
      icon: Eye,
      description: "Enhance image quality with AI",
    },
  };
function EditorSidebar({ project }) {

    const { activeTool }=useCanvas()

    const toolconfig=TOOL_CONFIGS[activeTool]

    if(!toolconfig)
    {
      return
    }
    const Icon=toolconfig.icon
  return (
    <div className='min-w-96 border-r flex flex-col '>
      <div className='p-4 border-b'>
        <div className='flex items-center gap-3'>
          <Icon className="h-5 w-5 text-white"/>
          <h2 className='text-lg font-semibold text-white'>
          {toolconfig.title}
          </h2>
        </div>
        <p className='text-sm text-white mt-1'>{toolconfig.description}</p>
      </div>
      <div className='flex-1 p-4 '>{renderConfig(activeTool,project)}</div>
    </div>
  )
}

const renderConfig=(activeTool,project)=>{
  console.log(activeTool)
  switch(activeTool)
  {
    case "crop":
      return <CropContent/>
    case "resize":
      return <ResizeControls project={project}/>
    case "adjust":
      return <AdjustControls/>
    case "background":
      return <BackgroundControls  project={project}/> 
    default:
      return <div className='text-white'> Select a tool to get Started</div>
  }
}
export default EditorSidebar
