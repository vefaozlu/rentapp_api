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
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const landlord = await context.prisma.landlord.findUnique({
        where: { userId: context.session.user.id },
      });

      const property = await context.prisma.property.create({
        data: {
          ...args,
          landlord: {
            connect: { id: landlord!.id },
          },
        },
      });

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
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const property = await context.prisma.property.update({
        where: { id: args.id },
        data: {
          name: args.name,
          address: args.address,
        },
      });

      return property;
    },

    deleteProperty: async (
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

      const property = await context.prisma.property.delete({
        where: { id: args.id },
      });

      return true;
    },
  },
};
