"use client"
import React from 'react'
import { api } from '@/convex/_generated/api'
import {useQuery}  from 'convex/react'
function page() {

  const data=useQuery(api.projects.getUserProjects)
  console.log(data);
  
  return (
    <div>
      <h1>
        this is a dashboard page of the website
      </h1>
    </div>
  )
}

export default page
