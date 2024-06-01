// This is used for getting user input.
import { createInterface } from "readline/promises";

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

export async function main() {
  const credentials = {
    accessKeyId: "YIBXBX5B22Y4PZISWERY",
    secretAccessKey: "oi00WUXuCoyXtvLwoAK8B1WtmWbBQqsRfe5iNoUy",
  };

  const s3Client = new S3Client({
    endpoint: "https://br-gru-1.linodeobjects.com",
    region: "br-gru-1",
    credentials: credentials,
  });

  const params = {
    Bucket: "file-box",
    Key: "file.txt",
    Body: "sou arquivo",
    ACL: "public-read",
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (error) {}
}

try {
  main();
} catch (error) {}
