import { requireRole } from "@/lib/auth-guard";
import { errorToResponse, ok } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { fileUploadSchema } from "@/lib/validations";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MEDIA_ASSET_TYPES = {
  mod: "mod-sketch",
  car: "car-sketch",
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"]);

    if(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_REGION || !process.env.S3_BUCKET_NAME) {
      throw new Error("Missing AWS credentials. Set AWS_BUCKET_NAME, AWS_REGION, and S3_BUCKET_NAME in .env.local");
    }

    const body = await req.json();
    const { fileName, contentType, type } = fileUploadSchema.parse(body);

    const key = `${MEDIA_ASSET_TYPES[type]}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const urls = {
      uploadUrl,
      publicUrl,
    };

    return ok(urls, "File uploaded successfully", 200);
  } catch (error) {
    console.log("Unexpected error in POST /media-assets/upload:", error);
    return errorToResponse(error);
  }
}