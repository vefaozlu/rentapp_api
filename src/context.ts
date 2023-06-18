import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
import { Auth } from "firebase/auth";
import { authenticateUser } from "./auth";
import {auth} from "../firebase/firebase";

const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  currentUser: User | null;
  auth: Auth;
};

export async function contextFactory(
  request: Request
): Promise<GraphQLContext> {
  return {
    prisma,
    currentUser: await authenticateUser(prisma, request),
    auth,
  };
}
