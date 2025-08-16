"use client"
import React from 'react'
import ProjectCard from './project-card'
import { useRouter } from 'next/navigation'

function ProjectsGrid({projects}) {
    const router = useRouter()

    const handleEditProject = (projectId) => {
        router.push(`/editor/${projectId}`)
    }
    console.log(projects)
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {
                projects.map((project) => {
                  return  <ProjectCard    
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
