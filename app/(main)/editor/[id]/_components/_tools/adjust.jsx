"use client"
import React, { useEffect, useState } from 'react'
import { filters } from 'fabric'
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';
import useCanvas from '@/context/context';
import { Slider } from '@/components/ui/slider';

const FILTER_CONFIGS = [
  {
    key: "brightness",
    label: "Brightness",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Brightness,
    valueKey: "brightness",
    transform: (value) => value / 100,
  },
  {
    key: "contrast",
    label: "Contrast",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Contrast,
    valueKey: "contrast",
    transform: (value) => value / 100,
  },
  {
    key: "saturation",
    label: "Saturation",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Saturation,
    valueKey: "saturation",
    transform: (value) => value / 100,
  },
  {
    key: "vibrance",
    label: "Vibrance",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Vibrance,
    valueKey: "vibrance",
    transform: (value) => value / 100,
  },
  {
    key: "blur",
    label: "Blur",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Blur,
    valueKey: "blur",
    transform: (value) => value / 100,
  },
  {
    key: "hue",
    label: "Hue",
    min: -180,
    max: 180,
    step: 1,
    defaultValue: 0,
    filterClass: filters.HueRotation,
    valueKey: "rotation",
    transform: (value) => value * (Math.PI / 180),
    suffix: "°",
  },
];

const DEFAULT_VALUES = FILTER_CONFIGS.reduce((acc, config) => {
  acc[config.key] = config.defaultValue;
  return acc;
}, {})
function AdjustControls() {

  const [filterValues, setFiltervalues] = useState(DEFAULT_VALUES)
  const [isApplying, setIsApplying] = useState(false)

  const { canvasEditor } = useCanvas()
  const getActiveImage = () => {
    if (!canvasEditor) return
    const activeObject = canvasEditor.getActiveObject()

    if (activeObject && activeObject.type == "image") return activeObject

    const objects = canvasEditor.getObjects()

    return objects.find((obj) => obj.type == "image") || null
  }
  const applyFilters = async (newValues) => {
    const imageObject = getActiveImage()
    console.log(imageObject)
    if (!imageObject || isApplying) return;
    setIsApplying(true)
    try {
      const filtersToApply = [];
      console.log("applying")
      FILTER_CONFIGS.forEach((config) => {
        const value = newValues[config.key];
        if (value !== config.defaultValue) {
          const transformedValue = config.transform(value);
          filtersToApply.push(
            new config.filterClass({
              [config.valueKey]: transformedValue,
            })
          );
        }
      });

      imageObject.filters = filtersToApply;

      await new Promise((resolve) => {
        imageObject.applyFilters();
        canvasEditor.requestRenderAll();
        setTimeout(resolve, 50);
      });
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsApplying(false);
    }
  }
  const resetfilters = () => {
    setFiltervalues(DEFAULT_VALUES);
    applyFilters(DEFAULT_VALUES);
  };

  const handleValueChange = (key, value) => {
    const newValues = {
      ...filterValues,
      [key]: Array.isArray(value) ? value[0] : value
    }
    setFiltervalues(newValues)

    applyFilters(newValues)
  }
  const extractFilterValues = (imageObject) => {
    if (!imageObject?.filters?.length) return DEFAULT_VALUES;

    const extractedValues = { ...DEFAULT_VALUES };

    imageObject.filters.forEach((filter) => {
      const config = FILTER_CONFIGS.find(
        (c) => c.filterClass.name === filter.constructor.name
      );
      if (config) {
        const filterValue = filter[config.valueKey];
        if (config.key === "hue") {
          extractedValues[config.key] = Math.round(
            filterValue * (180 / Math.PI)
          );
        } else {
          extractedValues[config.key] = Math.round(filterValue * 100);
        }
      }
    });

    return extractedValues;
  };


  useEffect(() => {
    const imageObject = getActiveImage();
    console.log(imageObject)
    if (imageObject?.filters) {
      const existingValues = extractFilterValues(imageObject);
      console.log(existingValues)
      setFiltervalues(existingValues);
    }
  }, [canvasEditor]);
  if (!canvasEditor) {
    return <>
      <div className='p-4'>
        <p className='text-white/70 text-sm'>
          Load an image  to start and adjusting
        </p>
      </div>
    </>
  }
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='text-sm font-medium text-white'>Image Adjustmemts</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetfilters}
          className={"text-white/70 hover:text-white"}
        >
          <RotateCcw className='h-4 w-4 mr-2' />
          Reset
        </Button>
      </div>
      {FILTER_CONFIGS.map((config) => {
        return <div key={config.key}>
          <div className='flex justify-between items-center'>
            <label className='text-sm text-white'>{config.label}</label>
            <span className='text-xs text-white/70'>
              {filterValues[config.key]}
              {config.suffix || ""}
            </span>
          </div>
          <Slider
            value={[filterValues[config.key]]}
            onValueChange={(value) => handleValueChange(config.key, value)}
            min={config.min}
            max={config.max}
            step={config.step}
            className={"w-full"}
          />
        </div>
      })}
      <div className='mt-6 bg-slate-700/50 rounded-lg'>
        <p className='text-xs text-white/70'>
          Adjustments are done in real time .Use the reset button to restor original vales.</p>
      </div>
      {
        isApplying && (
          <div className='flex items-center justify-center py-2'>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className='ml-2 text-xs text-white/70'>
              Applying filters....
            </span>
          </div>
        )

      }
    </div>
  )
}

export default AdjustControls
