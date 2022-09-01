import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { assign } from "lodash";

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
  try {
    console.log("post -->>", req.body);

    const post = await prisma.post.create({
      data: req.body,
    });

    return res.status(201).json(post);
  } catch (error) {
    console.log("error -->> ", error);

    throw new Error("Error creating post");
  }
};

// interface Query {
//   where: {
//     authorId?: Number;
//   }
// }

export const get_many = async (req: Request, res: Response) => {
  try {
    let query = {};

    if (req.query.author) {
      assign(query, {
        where: {
          authorId: Number(req.query.author),
        },
      });
    }

    const data = {
      count: await prisma.post.count(),
      posts: await prisma.post.findMany(query)
    }

    return res.status(200).json(data);
  } catch (error) {
    throw error;
  }
};
