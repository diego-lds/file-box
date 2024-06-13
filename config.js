import dotenv from "dotenv";
dotenv.config();

export default {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.LINODE_ENDPOINT,
};
