import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import getFileExtension from "../utils/getFileExtension.js";
import config from "../config.js";

const credentials = {
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
};
const client = new S3Client({
  endpoint: config.endpoint,
  region: "br-gru-1",
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

    console.log(result);

    const types = {
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

    const files = result.Contents.map((file) => ({
      extension: getFileExtension(file.Key),
      type: types[getFileExtension(file.Key)],
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
