import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
  try {
    /** Hash the password */
    req.body.secret = bcryptjs.hashSync(
      String(req.body.secret),
      bcryptjs.genSaltSync(10)
    );

    /** Insert new user in db */
    const user = await prisma.user.create({
      data: req.body,
    });

    return res.status(201).json([user]);
  } catch (error) {
    throw error;
  }
};

export const get_many = async (req: Request, res: Response) => {
  // await prisma.user.deleteMany({});
  console.log("with posts? ", req.query);
  
  const users = await prisma.user.findMany({
    include: {
      posts: {
        select: {
          title: true
        }
      }
    }
  });

  return res.status(200).json(users);
};

export const get_one = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if(!user) return res.status(404).json({
      "success": true,
      "message": "Not found."
    })

    return res.json([user]);
  } catch (error) {
    console.log("error getting users", error);

    throw error;
  }
};
