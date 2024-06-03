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
import { getFileExtension } from "./utils.js";

const ENDPOINT = "https://br-gru-1.linodeobjects.com";
const REGION = "br-gru-1";

const credentials = {
  accessKeyId: "YIBXBX5B22Y4PZISWERY",
  secretAccessKey: "oi00WUXuCoyXtvLwoAK8B1WtmWbBQqsRfe5iNoUy",
};
const client = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: credentials,
});

async function listAllFiles() {
  try {
    const result = await client.send(
      new ListObjectsCommand({
        Bucket: "file-box",
        ACL: "public-read",
      })
    );

    const files = result.Contents.map((file) => ({
      extension: getFileExtension(file.Key),
      etag: file.ETag.replace(/"/g, ""),
      name: file.Key,
      size: file.Size,
      lastModified: new Date(file.LastModified),
      url: `https://file-box.br-gru-1.linodeobjects.com/${file.Key}`,
    }));
    return files;
  } catch (error) {}
}

async function uploadFile(file) {
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: "file-box",
        Key: file.name,
        Body: file.data,
        ACL: "public-read",
      })
    );
    console.log(`${file.name} criado com sucesso em file-box`);
  } catch (error) {
    console.log(`erro ao fazer upload de arquivo`, error);
  }
}

async function deleteFile(params) {
  try {
    const res = await client.send(new DeleteObjectCommand(params));
    console.log(
      `arquivo ${params.Key} deletado com sucesso em [${params.bucket}]`
    );
    return res;
  } catch (error) {
    console.log(`erro ao fazer upload de arquivo`, error);
  }
}

export { listAllFiles, uploadFile, deleteFile };
