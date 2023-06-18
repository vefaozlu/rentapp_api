import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
require("dotenv").config();

export async function authenticateUser(
  prisma: PrismaClient,
  request: Request
): Promise<User | null> {
  if (request.headers.authorization) {
    try {
      const token = request.headers.authorization.split(" ")[1];
      const tokenPayload = verify(
        token,
        process.env.TOKEN_SECRET!
      ) as JwtPayload;
      const userId = tokenPayload.userId;
      return await prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      throw new Error("Token expired or invalid");
    }
  }

  return null;
}
