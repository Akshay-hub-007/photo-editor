import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useCanvas from '@/context/context';
import { FabricImage } from 'fabric';
import { ImageIcon, Palette, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';


const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNPLASH_ACCESS_KEY
const UNSPLASH_API_URL = "https://api.unsplash.com"
function BackgroundControls({ project }) {
  const { canvasEditor, processingMessage, setProcessingMessage } = useCanvas();
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  // Helper to validate hex color
  const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
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

  const handleColorbackground = () => {
    if (!canvasEditor) return;
    console.log("Applying color")
    console.log(backgroundColor)
    canvasEditor.backgroundColor = backgroundColor;
    canvasEditor.requestRenderAll();
  }

  const searchUnsplashImages=async()=>{
      if(!searchQuery.trim() || !UNSPLASH_ACCESS_KEY) return
      setIsSearching(true)
      try {
        const response=await fetch(`${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12`,{
          headers:{
            Authroization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        })
      } catch (error) {
        
      }
  }
  const handleKeyPress=(e)=>{
    if(e.key=="Enter")
    {
      searchUnsplashImages();
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
            <div className='space-y-4'>
              <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} style={{ width: "100%" }} />
            </div>
            <div className='flex items-center gap-2'>
              <Input
                value={backgroundColor}
                onChange={(e) => { setBackgroundColor(e.target.value) }}
                placeholder="#ffffff"
                className={"flex-1 bg-slate-700 border-white/20 text-white"}
              />
              <div className='w-10 h-10  rounded border  border-white/20'
                style={{ backgroundColor }}
              />
            </div>
            <Button
              onClick={handleColorbackground}
              className={"w-full"}
              variant={"primary"}
            >
              <Palette className='w-4 h-4 mr-2' />
              Apply Color
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="image" className={"space-y-4 mt-6"} >
          <div >
            <h3 className='text-sm  font-medium  text-white mb-2 '>
              Image Background
            </h3>
            <p className='text-xs text-white/70  mb-4'>
             Search  and use high-quality images from unsplash
            </p>
          </div>
          <div className='flex gap-2'>
            <Input
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for backgrounds..."
            className={"flex-1  bg-slate-700 border-white/20 text-white"}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BackgroundControls
