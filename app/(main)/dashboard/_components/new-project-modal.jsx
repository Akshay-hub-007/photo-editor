"use client"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import { usePlanAccess } from '@/hooks/use-plan-access'
import { useConvexMutation, useConvexQuery } from '@/hooks/useConvexQuery'
import { Crown, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'

function NewProjectModal({ isOpen, onClose }) {


    const [isUploading, setIsUploading] = useState(false)
    const [projectTitle, setProjectTitle] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState()

    const { data: projects } = useConvexQuery(api.projects.getUserProjects)
    const currentProjectCount = projects?.length || 0

    const { isFree, canCreateProject } = usePlanAccess()
    const canCreate = canCreateProject(currentProjectCount)
    const { mutate: createProject } = useConvexMutation(api.projects.create)
    console.log(currentProjectCount)
    const handleClose = () => {
        onClose()
    }
    const handleCreateProject = () => {

    }
    const onDrop = () => {

    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: [".png", ".jpg", ".jpeg", ".webp", ".gif"]
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
                            !selectedFile ? <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Upload className="h-12 w-12 text-white/50 mx-auto mb-4"/>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    {
                                    isDragActive ?
                                        <p>Drop Your Image here </p> :
                                        <p>Upload an Image</p>
                                }
                                </h3>
                            </div> : (
                                <>

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
