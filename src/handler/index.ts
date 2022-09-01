import "dotenv/config";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import JWT from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    if (!req.body.email || !req.body.secret)
      return res.status(400).json({ success: false, message: "Bad request." });

    const user = await prisma.user.findUnique({
      where: {
        email: String(req.body.email),
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User does not exists." });

    console.log("user found in login: ", user);

    if (!bcryptjs.compareSync(req.body.secret, user.secret))
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password." });

    const token = JWT.sign(req.body, String(process.env.SERVER_AUTH_SECRET));

    delete user.secret;

    return res.json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    throw error;
  }
};

export const root_path = (_req: Request, res: Response) => {
  return res.json({
    version: 1.0,
    name: "cvapi",
  });
};
