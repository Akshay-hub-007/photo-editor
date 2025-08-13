"use client"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/convex/_generated/api'
import { usePlanAccess } from '@/hooks/use-plan-access'
import { useConvexMutation, useConvexQuery } from '@/hooks/useConvexQuery'
import { Crown, ImageIcon, Loader2, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

function NewProjectModal({ isOpen, onClose }) {


    const [isUploading, setIsUploading] = useState(false)
    const [projectTitle, setProjectTitle] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState()
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const { data: projects } = useConvexQuery(api.projects.getUserProjects)
    const currentProjectCount = projects?.length || 0
    const router=useRouter()
    const { isFree, canCreateProject } = usePlanAccess()
    const canCreate = canCreateProject(currentProjectCount)
    const { mutate: createProject } = useConvexMutation(api.projects.create)
    console.log(currentProjectCount)
    const handleClose = () => {
        setIsUploading(false)
        setPreviewUrl(null)
        setSelectedFile(null)
        setProjectTitle("")
        onClose()
    }
    const handleCreateProject = async () => {
        if (!canCreate) {
            setShowUpgradeModal()
            return;
        }

        if (!selectedFile || !projectTitle.trim()) {
            toast.error("Please select the image and enter the project title")
            return
        }
        setIsUploading(true)

        try {
            const formData=new FormData()
            formData.append("file",selectedFile)
            formData.append("fileName",selectedFile.name)

            const uploadresponse=await fetch("/api/imagekit/upload",{
                method:"POST",
                body:formData
            })

            const uploadedData=uploadresponse.json()

            if(!uploadedData.success)
            {
                throw new Error(uploadedData.error|| "Failed to upload image")
            }

            const projectId=await createProject({
                title:projectTitle.trim(),
                originalImageUrl:uploadedData.url,
                currentImageUrl:uploadedData.url,
                thumbnailUrl:uploadedData.thumbnailUrl,
                width:uploadedData.width || 800,
                height:uploadedData.height|| 600,
                canvasState:null
            })

            toast.success("Project creates successfullt")

            router.push(`/editor/${projectId}`)
        } catch (error) {
            console.error("Error in creating project :",error)
            toast.error(error.message || "Failed to create project.Please try again")

        }finally{
            setIsUploading(false)
        }
    }
    const onDrop = (accecptedFiles) => {
        console.log(accecptedFiles)

        const file = accecptedFiles[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))

            const nameWithOutExt = file.name.replace(/\.[^/.]+$/, "");
            setProjectTitle(nameWithOutExt || "Untitled Project")
        }
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [".png", ".jpg", ".jpeg", ".webp", ".gif"]
        }
    })

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={handleClose} >
                <DialogContent className="max-w-2xl bg-slate-800 border-white/10">
                    <DialogHeader>
                        <DialogTitle className={"text-2xl font-bold text-white  "}>
                            Create New Project
                        </DialogTitle>
                        {true && (
                            <Badge variant="secondary" className='bg-slate-700 text-white/70'>
                                {currentProjectCount}/3 Projects
                            </Badge>
                        )}
                    </DialogHeader>
                    <div className='space-y-6'>
                        {
                            isFree && currentProjectCount >= 2 && (
                                <Alert className={"bg-amber-500/10 border-amber-500/20"}>
                                    <Crown className='h-5 w-5  text-amber-400' />
                                    <AlertDescription className="text-amber-500/80">
                                        <div className="font-semibold text-amber-400 mb-1">
                                            {currentProjectCount === 2
                                                ? "Final Free Project"
                                                : "Project Creation Blocked"}
                                        </div>
                                        <p className="text-sm leading-relaxed">
                                            {currentProjectCount === 2
                                                ? "This is your last project under the Free Plan. Continue creating without limits by upgrading to Pro."
                                                : "You have hit the 3-project cap on the Free Plan. No more projects can be created unless you upgrade to Pro."}
                                        </p>
                                    </AlertDescription>

                                </Alert>
                            )
                        }

                        {
                            !selectedFile ? <div {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all 
                                ${isDragActive ? "border-cyan-400 bg-cyan-400/5" : "border-white/20 hover:border-white/40"}
                                                        ${!canCreate ? "opacity-50 pointer-events-none" : ""}`}


                            >
                                <input {...getInputProps()} />
                                <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    {
                                        isDragActive ?
                                            <p>Drop Your Image here </p> :
                                            <p>Upload an Image</p>
                                    }
                                </h3>
                                <p className=' text-white/70 mb-4'>
                                    {
                                        canCreate ? "Drag and drop your image ,or click to browse" :
                                            "Upgrade to Pro to create More Projects"
                                    }
                                </p>

                                <p className='text-sm text-white/50'>
                                    Supports PNG,JPG,WEBP up to 20MB
                                </p>
                            </div> : (
                                <>
                                    <div className='space-y-6'>
                                        <div className='relative'>
                                            <img src={previewUrl} alt="Preview"
                                                className='w-full  h-64 object-cover rounded-xl  border border-white/10' />
                                            <Button
                                                variant="ghost"
                                                size={"icon"}
                                                onClick={() => {
                                                    setIsUploading(null)
                                                    setSelectedFile(null)
                                                    setProjectTitle("")
                                                }}
                                                className={"absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"}
                                            ><X className='w-4 h-4' /></Button>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor="project-title" >Project Title</Label>
                                            <Input
                                                id="project-title"
                                                type="text"
                                                value={projectTitle}
                                                onChange={(e) => setProjectTitle(e.target.value)}
                                                className={"bg-slate-700 border-white/20 text-white  placeholder-white/50 hover:border-cyan-400 focus:ring-cyan-400"}
                                            />
                                        </div>
                                        <div className='bg-slate-700/50 rounded-lg p-4'>
                                            <div className='flex items-center gap-3'>
                                                <ImageIcon className='w-5 h-5 text-cyan-400' />
                                                <div>
                                                    <p className='text-white/70 font-medium'>{selectedFile.name}</p>
                                                    <p>{(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            className={"text-white/70 hover:text-white "}>Cancel</Button>

                        <Button
                            onClick={handleCreateProject}
                            disabled={isUploading || !selectedFile || !projectTitle.trim()}
                            variant="primary"
                        >
                            {
                                isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating....
                                    </>
                                ) : (
                                    "Create Project"
                                )
                            }
                        </Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewProjectModal
