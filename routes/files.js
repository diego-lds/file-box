import express from "express";
import {
  listAllFiles,
  uploadFile,
  deleteFile,
  findAll,
} from "../services/fileService.js";
import sanitizeId from "../utils/sanitizeId.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const id = req.query.id;
  console.log(id);
  try {
    const files = await listAllFiles();
    res.json(files);
  } catch (error) {
    next(error);
  }
});

router.get("/findAll", async (req, res, next) => {
  const id = sanitizeId(req.query.id);
  try {
    const files = await findAll(id);
    res.json(files);
  } catch (error) {
    next(error);
  }
});

router.post("/upload", async (req, res, next) => {
  const { file } = req.files;
  const { userId } = req.body;
  console.log(userId);
  try {
    if (!req.files || !file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    await uploadFile(file, userId);
    res.json({ message: "Arquivo criado com sucesso" });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  const fileName = req.query.fileName;
  const id = req.query.id;
  try {
    const result = await deleteFile(fileName, id);

    if (!result) {
      return res.status(404).json({ message: "Arquivo não encontrado" });
    }

    res.json({ message: "Arquivo deletado com sucesso", result });
  } catch (error) {
    next(error);
  }
});

export default router;
