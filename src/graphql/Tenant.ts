import { Prisma, Tenant } from "@prisma/client";
import { GraphQLContext } from "../context";
import { Role } from "../model/Session";

export const TenantSchema = {
  Tenant: {
    id: (parent: Tenant) => parent.id,
    name: (parent: Tenant) => parent.name,
    email: (parent: Tenant) => parent.email,
    address: (parent: Tenant) => parent.address,
    phoneNumber: (parent: Tenant) => parent.phoneNumber,
    unitRented: (parent: Tenant, args: {}, context: GraphQLContext) => {
      return context.prisma.unit.findUnique({
        where: { tenantId: parent.id },
      });
    },
    balance: (parent: Tenant, args: {}, context: GraphQLContext) => {
      return context.prisma.balance.findUnique({
        where: { tenantId: parent.id },
      });
    }
  },

  Mutation: {
    createTenant: async (
      parent: unknown,
      args: {
        name: string;
        email: string;
        address: string;
        phoneNumber: string;
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

      const tenant = await context.prisma.tenant.create({
        data: {
          ...args,
        },
      });

      //  3

      const balance = await context.prisma.balance.create({
        data: {
          tenant: {
            connect: { id: tenant.id },
          },
        },
      });

      //  Success

      return tenant;
    },

    updateTenant: async (
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
      //  1

      if (
        context.session.user === null ||
        context.session.currentRole !== Role.TENANT
      ) {
        throw new Error("Unauthenticated");
      }

      //  2

      const tenant = await context.prisma.tenant.update({
        where: { id: args.id },
        data: {
          name: args.name,
          email: args.email,
          address: args.address,
          phoneNumber: args.phoneNumber,
        },
      });

      //  Success

      return tenant;
    },

    deleteTenant: async (
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

      const tenant = await context.prisma.tenant.delete({
        where: { id: args.id },
      });

      //  Success

      return true;
    },
  },
};
