import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imageKit=new ImageKit({
    publicKey:process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey:IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:NEXT_PUBLIC_IMAGEURL_UR_ENDPOINT
})

export async function POST(request)
{
    try {
        const {userId}=await auth()

        if(!userId)
        {
            return NextResponse.json({error:"Unauthroized"},{status:401})
        }

        const formData=await request.formData();
        const file=formData.get("file")
        const  fileName=formData.get("fileName")

        if(!file)
        {
            return NextResponse.json({error:"No file provided"},{status:400})
        }

        const bytes=await file.arrayBuffer()
        const Buffer=Buffer.from(bytes)
    } catch (error) {
        
    }
}