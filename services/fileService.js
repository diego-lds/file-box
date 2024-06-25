import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import getFileExtension from "../utils/getFileExtension.js";
import config from "../config.js";
import sanitizeId from "../utils/sanitizeId.js";

const credentials = {
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
};
const client = new S3Client({
  endpoint: config.endpoint,
  region: "br-gru-1",
  credentials: credentials,
});

const TYPES = {
  txt: "document",
  doc: "document",
  docx: "document",
  pdf: "document",
  png: "image",
  jpg: "image",
  mp3: "audio",
  mp4: "video",
  zip: "compressed",
  rar: "compressed",
};

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
      type: TYPES[getFileExtension(file.Key)],
      etag: file.ETag.replace(/"/g, ""),
      name: file.Key,
      size: file.Size,
      lastModified: new Date(file.LastModified),
      url: `https://file-box.br-gru-1.linodeobjects.com/${file.Key}`,
    }));

    return files;
  } catch (error) {}
}

async function findAll(id) {
  console.log(23, id);
  try {
    const result = await client.send(
      new ListObjectsCommand({
        Bucket: "file-box",
        ACL: "public-read",
        Prefix: id,
      })
    );
    const files = result.Contents.map((file) => ({
      name: file.Key.split("/")[1],
      extension: getFileExtension(file.Key),
      type: TYPES[getFileExtension(file.Key)],
      etag: file.ETag.replace(/"/g, ""),
      size: file.Size,
      lastModified: new Date(file.LastModified),
      url: `https://file-box.br-gru-1.linodeobjects.com/${file.Key}`,
    }));

    return files;
  } catch (error) {}
}

async function uploadFile(file, userId) {
  const key = sanitizeId(userId) + "/" + file.name;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: "file-box",
        Key: key,
        Body: file.data,
        ACL: "public-read",
      })
    );
    console.log(`${file.name} criado com sucesso em file-box`);
  } catch (error) {
    console.log(`erro ao fazer upload de arquivo`, error);
  }
}

async function deleteFile(fileName, id) {
  const key = sanitizeId(id) + "/" + fileName;
  try {
    const res = await client.send(
      new DeleteObjectCommand({
        Bucket: "file-box",
        Key: key,
      })
    );
    console.log(`arquivo ${fileName} deletado com sucesso em file-box`);
    return res;
  } catch (error) {
    console.log(`erro deletar de arquivo`, error);
  }
}

export { listAllFiles, uploadFile, deleteFile, findAll };
