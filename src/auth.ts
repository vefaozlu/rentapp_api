import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { Role, Session } from "./model/Session";
require("dotenv").config();

export async function authenticateUser(
  prisma: PrismaClient,
  request: Request
): Promise<Session> {
  if (request.headers.authorization) {
    //  1

    const token = request.headers.authorization.split(" ")[1];

    //  2

    const tokenPayload = verify(token, process.env.TOKEN_SECRET!) as JwtPayload;

    //  3

    const userId = tokenPayload.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    //  4

    const session: Session = {
      user: user!,
      currentRole: extractRole(tokenPayload.role) as Role,
    };
    return session;
  }

  //  5

  return { user: null, currentRole: null };
}

function extractRole(role: string): Role {
  if (role === "TENANT") return Role.TENANT;
  if (role === "LANDLORD") return Role.LANDLORD;
  return Role.ADMIN;
}
