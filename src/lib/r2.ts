import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { sanitizeFileName } from "@/lib/files/file-validation";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.R2_BUCKET_NAME!;

export async function uploadFileToR2({
  file,
  folder,
}: {
  file: File;
  folder: string;
}) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeFileName =
  sanitizeFileName(file.name);

  const key = `${folder}/${Date.now()}-${safeFileName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return key;
}

export async function deleteFileFromR2(key: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
}

export async function getR2DownloadUrl(key: string) {
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
    {
      expiresIn: 60 * 5,
    },
  );
}

export function getR2PublicUrl(key: string) {
  if (!process.env.R2_PUBLIC_URL) {
    return key;
  }

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
