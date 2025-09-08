import { Button } from '@/components/ui/button';
import useCanvas from '@/context/context';
import { Rect } from 'fabric';
import { Maximize, RectangleHorizontal, RectangleVertical, Smartphone, Square, Crop } from 'lucide-react';
import React, { useEffect, useState } from 'react'
const ASPECT_RATIOS = [
  { label: "Freeform", value: null, icon: Maximize },
  { label: "Square", value: 1, icon: Square, ratio: "1:1" },
  {
    label: "Widescreen",
    value: 16 / 9,
    icon: RectangleHorizontal,
    ratio: "16:9",
  },
  { label: "Portrait", value: 4 / 5, icon: RectangleVertical, ratio: "4:5" },
  { label: "Story", value: 9 / 16, icon: Smartphone, ratio: "9:16" },
];
function CropContent() {

  const { canvasEditor, activeTool } = useCanvas();

  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropMode, setIsCropMode] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState(null);
  const [cropRect, setCropRect] = useState(null);
  const [originalProps, setOriginalProps] = useState(null);
  const getActiveImage = () => {
    if (!canvasEditor) return null;

    const activeObject = canvasEditor.getActiveObject();
    if (activeObject && activeObject.type === "image") {
      return activeObject;
    }

    const objects = canvasEditor.getObjects();
    return objects.find((obj) => obj.type === "image") || null;
  };

  useEffect(() => {
    if (activeTool === "crop" && canvasEditor && isCropMode) {
      const image = getActiveImage();
      if (image) {
        initializeCropMode(image);
      }
    } else if (activeTool !== "crop" && isCropMode) {
      exitCropMode();
    }
  }, [activeTool, canvasEditor]);
  const removeAllCropRectangles=()=>{}
  const exitCropMode = () => { }
  const createCropRectangle = (image) => {

    const bounds = image.getBoundingRect()

    const cropRectangle = new Rect({
      left: bounds.left + bounds.width * 0.1,
      top: bounds.top + bounds.height * 0.1,
      width: bounds.width * 0.8,
      height: bounds.height * 0.8,
      fill: "transparent",
      stroke: "#00bcd4",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      evented: true,
      name: "cropRect",
      cornerColor: "#00bcd4",
      cornerSize: 12,
      transparentCorners: false,
      cornerStyle: "circle",
      borderColor: "#00bcd4",
      borderScaleFactor: 1,
      isCropRectangle: true,
    });

    cropRectangle.on("scaling", (e) => {
      const rect = e.target;

      // Apply aspect ratio constraint if selected
      if (selectedRatio && selectedRatio !== null) {
        const currentRatio =
          (rect.width * rect.scaleX) / (rect.height * rect.scaleY);
        if (Math.abs(currentRatio - selectedRatio) > 0.01) {
          // Adjust height to maintain ratio
          const newHeight =
            (rect.width * rect.scaleX) / selectedRatio / rect.scaleY;
          rect.set("height", newHeight);
        }
      }

      canvasEditor.requestRenderAll();
    });

    canvasEditor.add(cropRectangle);
    canvasEditor.setActiveObject(cropRectangle);
    setCropRect(cropRectangle);

  }
  const initializeCropMode = (image) => {
    if (!image || isCropMode) return;

    // First, remove any existing crop rectangles
    removeAllCropRectangles();

    // Store original image properties
    const original = {
      left: image.left,
      top: image.top,
      width: image.width,
      height: image.height,
      scaleX: image.scaleX,
      scaleY: image.scaleY,
      angle: image.angle || 0,
      selectable: image.selectable,
      evented: image.evented,
    };

    setOriginalProps(original);
    setSelectedImage(image);
    setIsCropMode(true);

    // Make image non-selectable to prevent default scaling
    image.set({
      selectable: false,
      evented: false,
    });

    // Create crop rectangle overlay
    createCropRectangle(image);

    canvasEditor.requestRenderAll();
  };
  const activeImage = getActiveImage()
  return (
    <div className="space-y-6">
      {/* Crop Mode Status */}
      {isCropMode && (
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
          <p className="text-cyan-400 text-sm font-medium">
            ✂️ Crop Mode Active
          </p>
          <p className="text-cyan-300/80 text-xs mt-1">
            Adjust the blue rectangle to set crop area
          </p>
        </div>
      )}

      {/* Start Crop Button */}
      {!isCropMode && activeImage && (
        <Button
          onClick={() => initializeCropMode(activeImage)}
          className="w-full"
          variant="primary"
        >
          <Crop className="h-4 w-4 mr-2" />
          Start Cropping
        </Button>
      )}
    </div>
  )
}

export default CropContent
