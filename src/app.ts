import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./router";
import morgan from "morgan";

const app = express();

export default async (port: number) => {
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(router);

  app.listen(port, () => {
    console.log(`Application runing on port ${port}`);
  });
};
