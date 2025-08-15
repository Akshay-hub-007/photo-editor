import React from 'react'
import ProjectCard from './project-card'
import { useRouter } from 'next/navigation'

function ProjectsGrid({projects}) {
    const router = useRouter()

    const handleEditProject = (projectId) => {
        router.push(`/editor/${projectId}`)
    }
    return (
        <div>
            {
                projects?.map((project) => {
                    <ProjectCard    
                        key={project._id}
                        project={project}
                        onEdit={() => handleEditProject(project._id)}
                    />

                })
            }
        </div>
    )
}

export default ProjectsGrid
