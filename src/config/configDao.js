import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const daoConfig = {
  useJsonStorage: false, //true usa almacenamiento JSON false usa MongoDB
  cartJsonFilePath: path.join(__dirname, "..", "dataData", "carts.json"),
  productJsonFilePath: path.join(__dirname, "..", "dataData", "products.json"),
  mongoDbUri: process.env.MONGODB_URI,
  jsonFileEncoding: "utf8",
  mongoDbOptions: { useNewUrlParser: true, useUnifiedTopology: true },
};

export default daoConfig;
