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
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

const credentials = {
  accessKeyId: "YIBXBX5B22Y4PZISWERY",
  secretAccessKey: "oi00WUXuCoyXtvLwoAK8B1WtmWbBQqsRfe5iNoUy",
};
const client = new S3Client({
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
export async function main() {
  // uploadObject(client, params);
  // deleteObject(client, params);
  listObjects(client, params);
}

async function uploadObject(client, params) {
  try {
    await client.send(new PutObjectCommand(params));
    console.log(
      `arquivo ${params.Key} criado com sucesso em [${params.bucket}]`
    );
  } catch (error) {
    console.log(`erro ao fazer upload de arquivo`, error);
  }
}
async function deleteObject(client, params) {
  try {
    await client.send(new DeleteObjectCommand(params));
    console.log(
      `arquivo ${params.Key} criado com sucesso em [${params.bucket}]`
    );
  } catch (error) {
    console.log(`erro ao fazer upload de arquivo`, error);
  }
}

async function listObjects(client, params) {
  try {
    const { Contents } = await client.send(new ListObjectsCommand(params));
    for (let obj of Contents) {
      console.log(obj.Key);
    }
  } catch (error) {}
}

try {
  main();
} catch (error) {}
