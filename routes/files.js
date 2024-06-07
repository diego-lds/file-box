import express from "express";
import {
  listAllFiles,
  uploadFile,
  deleteFile,
} from "../services/fileService.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const files = await listAllFiles();
    res.json(files);
  } catch (error) {
    next(error);
  }
});

router.post("/upload", async (req, res, next) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    await uploadFile(req.files.file);
    res.json({ message: "Arquivo criado com sucesso" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:bucketName/:key", async (req, res, next) => {
  try {
    const { bucketName, key } = req.params;
    const result = await deleteFile({ Bucket: bucketName, Key: key });

    if (!result) {
      return res.status(404).json({ message: "Arquivo não encontrado" });
    }

    res.json({ message: "Arquivo deletado com sucesso", result });
  } catch (error) {
    next(error);
  }
});

export default router;
