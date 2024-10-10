// C:\Users\aabeg\Dropbox\1.JavaScript\BACKEND\CoderHouse\Backend I\proyectoCoder\src\config\configDao.js

import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const daoConfig = {
  useJsonStorage: false, //true usa almacenamiento JSON false usa MongoDB
  cartJsonFilePath:
    "C:\\Users\\aabeg\\Dropbox\\1.JavaScript\\BACKEND\\CoderHouse\\Backend I\\proyectoCoder\\src\\dataData\\carts.json",
  productJsonFilePath:
    "C:\\Users\\aabeg\\Dropbox\\1.JavaScript\\BACKEND\\CoderHouse\\Backend I\\proyectoCoder\\src\\dataData\\products.json",
  mongoDbUri: process.env.MONGODB_URI,
  jsonFileEncoding: "utf8",
  mongoDbOptions: { useNewUrlParser: true, useUnifiedTopology: true },
};

export default daoConfig;
