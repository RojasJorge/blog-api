import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import * as _ from "lodash";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const find_id = (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id) {
    next();
  } else {
    res.status(200).json({
      success: false,
      message: "You need to send an id",
    });
  }
};

export const find_key = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.key === process.env.API_KEY) {
    next();
  } else {
    res.status(200).json({
      success: false,
      message: "You need a valid api key",
    });
  }
};

export const without_sensitive = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let oldSend = res.send;

  res.send = (data) => {
    res.send = oldSend;

    const parsed_data = JSON.parse(data);

    return res.send(
      !_.isArray(parsed_data)
        ? parsed_data
        : _.map(parsed_data, (user) => _.omit(user, ["secret"]))
    );
  };

  next();
};

export const autorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /** If authorization head does not exists. */
    if (!req.headers.authorization)
      return res.status(401).json({ success: false, message: "unauthorized" });

    /** Extract the token string. */
    const token = String(req.headers.authorization).replace("Bearer ", "");

    /** Verify the token. */
    const decoded = jwt.verify(
      token,
      String(process.env.SERVER_AUTH_SECRET),
      (_err, usr) => usr
    );

    /** Reject if token fails. */
    if (!decoded)
      return res.status(401).json({ success: false, message: "unauthorized" });

    /** Fetch user in db by email. */
    const user = await prisma.user.findUnique({
      where: {
        email: String(decoded.email),
      },
    });

    /** 401 error if user does not exists in db. */
    if (!user)
      return res.status(401).json({ success: false, message: "unauthorized" });

    /** If validation is success, continue the request :) */
    next();
  } catch (error) {
    throw error;
  }
};
