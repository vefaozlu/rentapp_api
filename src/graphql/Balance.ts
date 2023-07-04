import { Balance } from "@prisma/client";
import { GraphQLContext } from "../context";
import { Role } from "../model/Session";
import { PubSubChannels } from "../pubsub";
import { withFilter } from "graphql-subscriptions";

export const BalanceSchema = {
  Balance: {
    id: (parent: Balance) => parent.id,
    balance: (parent: Balance) => parent.balance,
    payPeriod: (parent: Balance) => parent.payPeriod,
    currentPeriodEnd: (parent: Balance) => parent.currentPeriodEnd,
    tenant: (parent: Balance, args: {}, context: GraphQLContext) => {
      return context.prisma.balance
        .findUnique({
          where: { id: parent.id },
        })
        .tenant();
    },
  },

  Mutation: {
    updateBalance: async (
      parent: unknown,
      args: { id: number; balance: number },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const balance = await context.prisma.balance.update({
        where: { id: args.id },
        data: {
          balance: args.balance,
        },
      });

      context.pubSub.publish("BALANCE", {
        tenantId: balance.tenantId,
        balance: balance,
      });

      return balance;
    },
  },

  Subscription: {
    balance: {
      subscribe: withFilter(
        (parent: unknown, args: {}, context: GraphQLContext) =>
          context.pubSub.asyncIterator("BALANCE"),
        (payload: PubSubChannels["BALANCE"][0], variables) => {
          return payload.tenantId === variables.userId;
        }
      ),
      resolve: (payload: PubSubChannels["BALANCE"][0]) => {
        return payload.balance;
      },
    },
  },
};
