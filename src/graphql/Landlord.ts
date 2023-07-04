import { Landlord } from "@prisma/client";
import { GraphQLContext } from "../context";
import { Role } from "../model/Session";

export const LandlordSchema = {
  Landlord: {
    id: (parent: Landlord) => parent.id,
    name: (parent: Landlord) => parent.name,
    email: (parent: Landlord) => parent.email,
    address: (parent: Landlord) => parent.address,
    phoneNumber: (parent: Landlord) => parent.phoneNumber,
    properties: (parent: Landlord, args: {}, context: GraphQLContext) => {
      return context.prisma.property.findMany({
        where: { landlordId: parent.id },
      });
    },
  },

  Mutation: {
    createLandlord: async (
      parent: unknown,
      args: {
        name: string;
        email: string;
        address: string;
        phoneNumber: string;
      },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const landlord = await context.prisma.landlord.create({
        data: {
          ...args,
          user: {
            connect: { id: context.session.user.id },
          },
        },
      });

      return landlord;
    },

    updateLandlord: async (
      parent: unknown,
      args: {
        id: number;
        name: string;
        email: string;
        address: string;
        phoneNumber: string;
      },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const landlord = await context.prisma.landlord.update({
        where: { id: args.id },
        data: {
          name: args.name,
          email: args.email,
          address: args.address,
          phoneNumber: args.phoneNumber,
        },
      });

      return landlord;
    },

    deleteLandlord: async (
      parent: unknown,
      args: { id: number },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const landlord = await context.prisma.landlord.delete({
        where: { id: args.id },
      });

      return true;
    },
  },
};
