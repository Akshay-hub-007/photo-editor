"use client"
import React, { useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { useConvexQuery } from '@/hooks/useConvexQuery'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'
import { BarLoader } from 'react-spinners'
import NewProjectModal from './_components/new-project-modal'
function page() {

  const [newProjectModal, setNewProjectModal] = useState(false)


  const {data:projects,isLoading,error} = useConvexQuery(api.projects.getUserProjects)
  // console.log( );

  return (
    <div className='min-h-screen pt-32 pb-16'>
      <div className='container mx-auto px-6'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-white mb-2'>Your Projects</h1>
            <p className='text-white/70'>
              Create and design AI powered Image designs</p>
          </div>
          <Button
            onClick={() => setNewProjectModal(true)}
            size="lg" variant="primary" className={"gap-2"}>
            <Plus className='h-5 w-5' />
            New Project
          </Button>
        </div>
          {isLoading?<BarLoader width="100%" color="white"/>:
          projects && projects.length>0?(
            <></>
          ):<>
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <h3 className='text-2xl font-bold text-white mb-3'>
              Create Your First  Project
            </h3>
            <p className='text-white/70 mb-8 max-w-md'>
            Upload an image to start editing  with out powerful AI Tools
            </p>

             <Button
            onClick={() => setNewProjectModal(true)}
            size="lg" variant="primary" className={"gap-2"}>
            <Sparkles className='h-5 w-5' />
            Start  Creating
          </Button>
          </div>
          </>}

          <NewProjectModal
          isOpen={newProjectModal}
          onClose={()=>setNewProjectModal(false)}
          />
      </div>
    </div>
  )
}

export default page
