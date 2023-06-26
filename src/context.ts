import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { Auth } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { authenticateUser } from "./auth";
import { Session } from "./model/Session";
import BalanceClient from "../mongodb/balance";

const prisma = new PrismaClient();
const balance = new BalanceClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  session: Session;
  auth: Auth;
  balance: BalanceClient;
};

export async function contextFactory(
  request: Request
): Promise<GraphQLContext> {
  return {
    prisma,
    session: await authenticateUser(prisma, request),
    auth,
    balance,
  };
}
