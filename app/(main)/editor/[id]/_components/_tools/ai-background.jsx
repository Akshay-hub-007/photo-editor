import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useCanvas from '@/context/context';
import { FabricImage } from 'fabric';
import { ImageIcon, Palette, Trash2 } from 'lucide-react';
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
  const getMainImage = () => {
    if (!canvasEditor) return null;

    const objects = canvasEditor.getObjects()

    return objects.find((obj) => obj.type === "image") || null
  }

  const handleBackgroundRemoval = async () => {

    const mainImage = getMainImage()
    if (!mainImage || !project) return;
    setProcessingMessage("Removing backgroung with AI")
    try {
      console.log(project)
      const currentImageUrl = project?.currentImageUrl || project.originalImage;
      console.log(typeof currentImageUrl);
      let bgRemoval = currentImageUrl;
      if (typeof currentImageUrl === 'string' && currentImageUrl.includes("ik.imagekit.io")) {
        bgRemoval = `${currentImageUrl.split("?")[0]}?tr=e-bgremove`;
      }
      const processedImage = await FabricImage.fromURL(bgRemoval, {
        crossOrigin: "anonymous"
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
    } finally {
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

        {
          !getMainImage() && (
            <p className='text-xs text-amber-400'>
              Please   add an image to remove the background
            </p>
          )
        }
      </div>

      <Tabs defaultValue="color" className={"w-full"}>
        <TabsList className={"grid w-full grid-cols-2  bg-slate-700/50"}>
          <TabsTrigger
            value="color"
            className={"data-[state=active]:bg-cyan-400 data-[state=active]:text-white"}
          >
            <Palette className='h-4 w-4 mr-2' /> Color
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className={"data-[state=active]:bg-cyan-400 data-[state=active]:text-white"}
          >
            <ImageIcon className='h-4 w-4 mr-2' /> Image
          </TabsTrigger>
        </TabsList>
        <TabsContent value="color" className={"space-y-4 mt-6"}>
          <div>
            <h3 className='text-sm font-mediu text-white mb-2'>
              Solid Color background
            </h3>
            <p className='text-xs  text-white/70 mb-4'>
              Choose a Solid Color for your canvas background

            </p>
          </div>
        </TabsContent>
        <TabsContent value="image" className={"space-y-4 mt-6"}>
          Make Changes  to your account here
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BackgroundControls
