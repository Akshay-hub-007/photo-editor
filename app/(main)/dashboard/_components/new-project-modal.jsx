import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import { usePlanAccess } from '@/hooks/use-plan-access'
import { useConvexQuery } from '@/hooks/useConvexQuery'
import { Crown } from 'lucide-react'
import React from 'react'

function NewProjectModal({ isOpen, onClose }) {


    const { data: projects } = useConvexQuery(api.projects.getUserProjects)
    const currentProjectCount = projects?.length || 0
    
    const { isFree, canCreateProject } = usePlanAccess()
    const canCreate = canCreateProject(currentProjectCount)
    console.log(currentProjectCount)
    const handleClose = () => {
        onClose()
    }
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
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            className={"text-white/70 hover:text-white "}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewProjectModal
