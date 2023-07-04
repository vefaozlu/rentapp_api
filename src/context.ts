import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { Auth } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { authenticateUser } from "./auth";
import { Session } from "./model/Session";
import { pubSub } from "./pubsub";

const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  session: Session;
  auth: Auth;
  pubSub: typeof pubSub;
};

export async function contextFactory(
  request: Request
): Promise<GraphQLContext> {
  return {
    prisma,
    session: await authenticateUser(prisma, request),
    auth,
    pubSub,
  };
}
