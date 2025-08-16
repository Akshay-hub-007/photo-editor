import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { useConvexMutation } from '@/hooks/useConvexQuery'
import { useConvexConnectionState } from 'convex/react'
import { CardSim, Edit, Trash } from 'lucide-react'
import React from 'react'
import { formatDistanceToNow } from "date-fns"
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
function ProjectCard({ project, onEdit }) {

  const { mutate: deleteProject, isLoading } = useConvexMutation(api.projects.deleteProject)
  console.log(project)

  const handleDelete = async () => {
      const confirmed=confirm(
        `Are you sure want to delete the project ${project.title} ? This action cannot be undone.`
      )

      if(confirmed)
      {
        try {
          await deleteProject({projectId:project._id})
          toast.success("Project deleted successfully")
        } catch (error) {
          console.log("Error in deleting project:",error)
          toast.error("Failed to delete project.Please try again")
        }
      }
  }
  const lastUpdated = formatDistanceToNow(new Date(project?.updatedAt))
  return (

    <Card className={"py-0 group relative bg-slate-800/50 overflow-hidden hover:border-white/20 transition-all hover:transform hover:scale-[1.02]"}>
      <div className='aspect-video bg-slate-70 relative overflow-hidden'>
        {
          project?.thumbnailImageUrl && (
            <img src={project.thumbnailImageUrl} alt={project.title} className='w-full h-full object-cover' />
          )
        }

        <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity  flex items-center justify-center gap-2'>
          <Button variant="glass" size="sm" onClick={onEdit} className={"gap-2"}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant={"glass"}
            className={"gap-2 text-red-400 hover:text-red-300"}
            onClick={handleDelete}
            disabled={isLoading}

          >
            <Trash className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
      <CardContent className={"pb-6"}>
        <h3 className='font-semibold text-white truncate mb-1'>{project.title}</h3>
        <div className='flex items-center justify-center text-sm text-white/70 gap-2'>
          <span>Updated {lastUpdated}</span>
          <Badge
            variant={"secondary"}
            className={"text-sm bg-slate-700 text-whte/70"}
          >
            {project.width} X {project.height}
          </Badge>

        </div>
      </CardContent>
    </Card>

  )
}

export default ProjectCard
