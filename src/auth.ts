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
    try {
      const token = request.headers.authorization.split(" ")[1];
      
      const tokenPayload = verify(
        token,
        process.env.TOKEN_SECRET!
      ) as JwtPayload;

      const userId = tokenPayload.userId;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const session: Session = {
        user: user!,
        currentRole: extractRole(tokenPayload.role) as Role,
      };
      return session;
    } catch (error) {
      throw new Error("Token expired or invalid");
    }
  }

  return { user: null, currentRole: null };
}

function extractRole(role: string): Role {
  if (role === "RENTER") return Role.RENTER;
  if (role === "LANDLORD") return Role.LANDLORD;
  return Role.ADMIN;
}
