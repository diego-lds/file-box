// server.js
import express from "express";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import cors from "cors";

import { deleteFile, listAllFiles, uploadFile } from "./service.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(fileUpload());

app.get("/files", async (req, res) => {
  console.log(1);
  const files = await listAllFiles();
  res.json({ files });
});
app.post("/upload", (req, res) => {
  uploadFile(req.files.file);
  res.json({ message: "Arquivo criado com sucesso" });
});

app.delete("/files/:bucketName/:key", (req, res) => {
  const { bucketName, key } = req.params;

  const result = deleteFile({ Bucket: bucketName, Key: key });

  res.json(result);
});

app.listen(3000, () => {
  console.info(`Server is running on http://localhost:3000`);
});
