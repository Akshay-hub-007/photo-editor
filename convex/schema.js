import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"


export default defineSchema({
    users: defineTable({
        name: v.string(),
        email:v.string(),
        tokenIdentifier: v.string(),
        imageUrl:v.optional(v.string()),

        plan:v.union(v.literal("free"),v.literal("pro")),

        projectsUsed:v.number(),
        exportsThisMonth:v.number(),

        createdAt:v.number(),
        lastActiveAt:v.number()
    }).index("by_token", ["tokenIdentifier"])
      .index("by_email",["email"])
      .searchIndex("search_name",{searchField:"name"})
      .searchIndex("search_email",{searchField:"email"}),


      projects:defineTable({
            title:v.string(),
            userId:v.id("users"),

            canvaState:v.any(),
            width:v.number(),
            height:v.number(),

            originalImage:v.optional(v.string()),
            currrentImageUrl:v.optional(v.string()),
            thumbnailImageUrl:v.optional(v.string()),

            activeTransformations:v.optional(v.string()),

            backgroundRemoved:v.optional(v.boolean()),
            
            folderId:v.optional(v.string()),

            createdAt:v.number(),
            updatedAt:v.number()

      }).index("by_user",["userId"])
      .index("user_by_update",["userId","updatedAt"])
      .index("by_folder",["folderId"]),

      folders:defineTable({
        name:v.string(),
        userId:v.id("users"),
        createdAt:v.number()
      }).index("by_user",["userId"])
})