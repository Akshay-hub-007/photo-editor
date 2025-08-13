import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEURL_UR_ENDPOINT
});

export async function POST(request) {
    try {
       
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        console.log(request)
        const formData = await request.formData();
        console.log(formData)
        const file = formData.get("file");
        const fileName = formData.get("fileName");

        if (!file) {
            return NextResponse.json({ success: false, error: "Missing file parameter for upload" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const sanitizeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_") || "upload";
        const uniqueFileName = `${userId}/${timestamp}_${sanitizeFileName}`;

        // Upload the file
        const uploadResponse = await imageKit.upload({
            file: buffer,
            fileName: uniqueFileName,
            folder: "/projects"
        });

        // Generate thumbnail URL using transformation
        const thumbnailUrl = imageKit.url({
            src: uploadResponse.url,
            transformation: [
                {
                    width: 300,
                    height: 400,
                    crop: "maintain_ratio",
                    quality: 80
                }
            ]
        });

        return NextResponse.json({
            success: true,
            url: uploadResponse.url,
            thumbnailUrl: thumbnailUrl,
            fileId: uploadResponse.fileId,
            width: uploadResponse.width,
            height: uploadResponse.height,
            size: uploadResponse.size,
            name: uploadResponse.name
        });
    } catch (error) {
        console.error("Imagekit Upload Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to upload image",
                details: error.message
            },
            { status: 500 }
        );
    }
}