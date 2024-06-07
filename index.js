import express from "express";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import filesRouter from "./routes/files.js";
import errorHandler from "./utils/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(fileUpload());
app.use(morgan("dev"));

// Rotas
app.use("/files", filesRouter);

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});
