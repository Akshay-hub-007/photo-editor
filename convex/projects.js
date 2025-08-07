import { mutation } from "./_generated/server";

    export const create =mutation({
        args:{
            title:v.string(),
            originalImageUrl:v.optional(v.string()),
            currentImageUrl:v.optional(v.string()),
            thumbnailUrl:v.optional(v.string()),
            width:v.number(),
            height:v.number(),
            canvasState:v.optional(v.any())
        },
        handler:async(ctx,args)=>{

            const user=ctx.runQuery(internal.users.getCurrentUser)

            if(user.plan==="free")
            {
                const projecCount=await ctx.db
                                        .query("projecs")
                                        .withIndex("by_user",(q)=> q.eq("userId",user._id))
                                        .collect()
                if(projecCount.length>3)
                {
                    throw new Error("Free plan  limited to 3 Projects.Upgraded to Pro for unlimited projects    ")
                }

            }

            await ctx.db.insert("projects",{
                title:args.title,
                userId:user._id,
                originalImage:args.originalImageUrl,
                currrentImageUrl:args.currentImageUrl,
                thumbnailImageUrl:args.thumbnailUrl,
                width:args.width,
                height:args.height,
                canvasState:args.canvasState,
                createdAt:Date.now(),
                updatedAt:Date.now()
            })

            await ctx.db.patch(user._id,{
                projectsUsed:user.projectsUsed+1,
                lastActiveAt:Date.now()
            })
            return projectId
        }
    })

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    // Delete the project
    await ctx.db.delete(args.projectId);

    // Update user's project count
    await ctx.db.patch(user._id, {
      projectsUsed: Math.max(0, user.projectsUsed - 1),
      lastActiveAt: Date.now(),
    });

    return { success: true };
  },
});

// Get a single project by ID
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    return project;
  },
});