import { Button } from '@/components/ui/button';
import useCanvas from '@/context/context';
import { FabricImage } from 'fabric';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';


const UNPLASH_API_KEY = process.env.NEXT_PUBLIC_UNPLASH_ACCESS_KEY
const UNPLASH_API_URL = "https://api.unsplash.com"
function BackgroundControls({ project }) {
  const { canvasEditor, processingMessage, setProcessingMessage } = useCanvas();
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const getMainImage=()=>{
      if(!canvasEditor) return null;    
      
      const objects=canvasEditor.getObjects()

      return objects.find((obj)=>obj.type ==="image") || null
  }

  const handleBackgroundRemoval=async ()=>{
    
    const mainImage=getMainImage()
    if(!mainImage || !project)  return;
    setProcessingMessage("Removing backgroung with AI")
    try {
      console.log(project)
      const currentImageUrl = project?.currentImageUrl || project.originalImage;
      console.log(typeof currentImageUrl);
      let bgRemoval = currentImageUrl;
      if (typeof currentImageUrl === 'string' && currentImageUrl.includes("ik.imagekit.io")) {
        bgRemoval = `${currentImageUrl.split("?")[0]}?tr=e-bgremove`;
      }
        const processedImage=await  FabricImage.fromURL(bgRemoval,{
          crossOrigin:"anonymous"
        })
        const currentProps = {
          left: mainImage.left,
          top: mainImage.top,
          scaleX: mainImage.scaleX,
          scaleY: mainImage.scaleY,
          angle: mainImage.angle,
          originX: mainImage.originX,
          originY: mainImage.originY
        };

        canvasEditor.remove(mainImage);
        processedImage.set(currentProps);
        canvasEditor.add(processedImage);

        processedImage.setCoords();
        canvasEditor.setActiveObject(processedImage);
        canvasEditor.calcOffset();
        canvasEditor.requestRenderAll();
    } catch (error) {
      console.log("error removing background", error);
      toast.error("Error in removing background");
    }finally{
      setProcessingMessage(null)
    }
  }
  
  return (
    <div className='space-y-6 relative h-full'>
      <div>

        <div>
          <h3 className='text-sm font-medium tex-white mb-2'>
            AI Background Removal
          </h3>
          <p>
            Automatically remove the background from your image using AI
          </p>
        </div>
        <Button className={"w-full"} variant={"primary"}
        onClick={handleBackgroundRemoval || !getMainImage}

        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove Image Background
        </Button>
      </div>
    </div>
  )
}

export default BackgroundControls
