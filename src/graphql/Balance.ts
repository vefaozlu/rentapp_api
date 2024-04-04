import { Balance } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { GraphQLContext } from "../context";
import { Role } from "../model/Session";
import { PubSubChannels } from "../pubsub";

export const BalanceSchema = {
  Balance: {
    id: (parent: Balance) => parent.id,
    isActive: (parent: Balance) => parent.isActive,
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
      //  1

      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new GraphQLError("Unauthenticated", {
          extensions: { code: 401 },
        });
      }

      //  2

      try {
        const balance = await context.prisma.balance.update({
          where: { id: args.id },
          data: {
            balance: args.balance,
          },
        });

        //  Success

        context.pubSub.publish("BALANCE", {
          tenantId: balance.tenantId,
          balance: balance,
        });

        return balance;
      } catch (e) {
        //  Failure

        throw new Error("Something went wrong");
      }
    },
  },

  Subscription: {
    balance: {
      subscribe: withFilter(
        (parent: unknown, args: {}, context: GraphQLContext) => {
          //  1

          if (context.session.user === null) {
            throw new GraphQLError("Unauthenticated", {
              extensions: { code: 401 },
            });
          }

          //  2

          return context.pubSub.asyncIterator("BALANCE");
        },
        (payload: PubSubChannels["BALANCE"][0], variables) => {
          return payload.tenantId === variables.tenantId;
        }
      ),
      resolve: (payload: PubSubChannels["BALANCE"][0]) => {
        return payload.balance;
      },
    },
  },
};
