import express from "express";

import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import filesRouter from "./routes/files.js";
import errorHandler from "./utils/errorHandler.js";
import { configDotenv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import compression from "compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
configDotenv();

const app = express();

function isProduction() {
  return process.env.NODE_ENV === "production";
}
const baseUrl =
  process.env.BASE_URL ||
  (isProduction() ? "https://api.minhaprodurl.com" : "http://localhost:3000");

app.use(express.static(path.join(__dirname, "dist")));
app.use(compression());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
  "https://file-box-front.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());
app.use(fileUpload());
app.use(morgan("dev"));

// Rotas
app.use("/files", filesRouter);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.info(`Server is running on ${baseUrl}`);
});
