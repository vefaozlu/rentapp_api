import { Property } from "@prisma/client";
import { GraphQLContext } from "../context";
import { Role } from "../model/Session";

export const PropertySchema = {
  Property: {
    id: (parent: Property) => parent.id,
    name: (parent: Property) => parent.name,
    address: (parent: Property) => parent.address,
    units: (parent: Property, args: {}, context: GraphQLContext) => {
      return context.prisma.unit.findMany({
        where: { propertyId: parent.id },
      });
    },
    announcements: (parent: Property, args: {}, context: GraphQLContext) => {
      return context.prisma.announcement.findMany({
        where: { propertyId: parent.id },
      });
    },
    landlord: (parent: Property, args: {}, context: GraphQLContext) => {
      return context.prisma.landlord.findUnique({
        where: { id: parent.landlordId },
      });
    },
  },

  Mutation: {
    createProperty: async (
      parent: unknown,
      args: {
        name: string;
        address: string;
      },
      context: GraphQLContext
    ) => {
      //  1

      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      //  2

      const landlord = await context.prisma.landlord.findUnique({
        where: { userId: context.session.user.id },
      });

      //  3

      const property = await context.prisma.property.create({
        data: {
          ...args,
          landlord: {
            connect: { id: landlord!.id },
          },
        },
      });

      //  Success

      return property;
    },

    updateProperty: async (
      parent: unknown,
      args: {
        id: number;
        name: string;
        address: string;
      },
      context: GraphQLContext
    ) => {
      //  1

      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      //  2

      const property = await context.prisma.property.update({
        where: { id: args.id },
        data: {
          name: args.name,
          address: args.address,
        },
      });

      //  Success

      return property;
    },

    deleteProperty: async (
      parent: unknown,
      args: { id: number },
      context: GraphQLContext
    ) => {
      //  1

      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      //  2

      const property = await context.prisma.property.delete({
        where: { id: args.id },
      });

      //  Success

      return true;
    },
  },
};
