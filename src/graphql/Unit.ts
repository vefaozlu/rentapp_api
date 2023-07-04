import { Unit } from "@prisma/client";
import { GraphQLContext } from "../context";
import { Role } from "../model/Session";

export const UnitSchema = {
  Unit: {
    id: (parent: Unit) => parent.id,
    name: (parent: Unit) => parent.name,
    payPeriod: (parent: Unit) => parent.payPeriod,
    rentAmount: (parent: Unit) => parent.rentAmount,
    deposit: (parent: Unit) => parent.deposit,
    isVacant: (parent: Unit) => parent.isVacant,
    property: (parent: Unit, args: {}, context: GraphQLContext) => {
      return context.prisma.property.findUnique({
        where: { id: parent.id },
      });
    },
    tenant: async (parent: Unit, args: {}, context: GraphQLContext) => {
      if (!parent.tenantId) return null;

      return await context.prisma.tenant.findUnique({
        where: { id: parent.tenantId },
      });
    },
  },

  Mutation: {
    createUnit: async (
      parent: unknown,
      args: {
        name: string;
        payPeriod: number;
        rentAmount: number;
        deposit: number;
        propertyId: number;
        tenantId: number;
      },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const unit = await context.prisma.unit.create({
        data: {
          name: args.name,
          payPeriod: args.payPeriod,
          rentAmount: args.rentAmount,
          deposit: args.deposit,
          isVacant: false,
          property: {
            connect: { id: args.propertyId },
          },
          tenant:
            args.tenantId === null
              ? undefined
              : {
                  connect: { id: args.tenantId },
                },
        },
      });

      return unit;
    },

    updateUnit: async (
      parent: unknown,
      args: {
        id: number;
        name: string;
        payPeriod: number;
        rentAmount: number;
        deposit: number;
      },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const unit = await context.prisma.unit.update({
        where: { id: args.id },
        data: {
          name: args.name,
          payPeriod: args.payPeriod,
          rentAmount: args.rentAmount,
          deposit: args.deposit,
        },
      });

      return unit;
    },

    registerTenantToUnit: async (
      parent: unknown,
      args: { unitId: number; tenantId: number },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const unit = await context.prisma.unit.findUnique({
        where: { id: args.unitId },
      });

      const tenant = await context.prisma.tenant.findUnique({
        where: { id: args.tenantId },
      });

      if (!unit || !tenant) {
        throw new Error("Unit or tenant does not exist");
      }

      if (unit.tenantId !== null) {
        throw new Error("Unit is already occupied");
      }

      const updatedUnit = await context.prisma.unit.update({
        where: { id: args.unitId },
        data: {
          tenant: {
            connect: { id: args.tenantId },
          },
        },
      });

      return updatedUnit;
    },

    removeTenantFromUnit: async (
      parent: unknown,
      args: { unitId: number; tenantId: number },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const unit = await context.prisma.unit.findUnique({
        where: { id: args.unitId },
      });

      const tenant = await context.prisma.tenant.findUnique({
        where: { id: args.tenantId },
      });

      if (!unit || !tenant) {
        throw new Error("Unit or tenant does not exist");
      }

      if (unit.tenantId === null) {
        throw new Error("Unit is already vacant");
      }

      const updatedUnit = await context.prisma.unit.update({
        where: { id: args.unitId },
        data: {
          tenant: {
            disconnect: true,
          },
        },
      });

      return updatedUnit;
    },

    deleteUnit: async (
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

      const unit = await context.prisma.unit.delete({
        where: { id: args.id },
      });

      return true;
    },
  },
};
