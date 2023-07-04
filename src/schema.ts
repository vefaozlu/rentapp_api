import { makeExecutableSchema } from "@graphql-tools/schema";
import "graphql-import-node";
import typeDefs from "./schema.graphql";
require("dotenv").config();
import {
  AnnouncementSchema,
  BalanceSchema,
  LandlordSchema,
  PropertySchema,
  TenantSchema,
  UnitSchema,
  UserSchema,
} from "./graphql/index";

/* const resolvers = {
   Query: {
    info: () => `This is the API of RentApp`,
    user: (parent: unknown, args: {}, context: GraphQLContext) => {
      if (context.session.user === null) {
        throw new Error("Unauthenticated");
      }

      return context.session.user;
    },

    profile: (parent: unknown, args: {}, context: GraphQLContext) => {
      if (context.session.user === null) {
        throw new Error("Unauthenticated");
      }

      if (context.session.currentRole === Role.TENANT) {
        const tenant = context.prisma.tenant.findUnique({
          where: { userId: context.session.user.id },
        });

        const user = context.session.user;
        const role = context.session.currentRole;

        return {
          user,
          tenant,
          role,
        };
      }

      if (context.session.currentRole === Role.LANDLORD) {
        const landlord = context.prisma.landlord.findUnique({
          where: { userId: context.session.user.id },
        });

        const user = context.session.user;
        const role = context.session.currentRole;

        return {
          user,
          landlord,
          role,
        };
      }
    },
  }, */
/*   Subscription: {
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
  }, */
/*Mutation: {
    signup: async (
      parent: unknown,
      args: { email: string; password: string; name: string; role: string },
      context: GraphQLContext
    ) => {
      var firebaseId = "";

      await createUserWithEmailAndPassword(
        context.auth,
        args.email,
        args.password
      )
        .then((userCredential) => {
          firebaseId = userCredential.user.uid;
        })
        .catch((error) => {
          throw new Error(error);
        });

      const user = await context.prisma.user.create({
        data: {
          email: args.email,
          username: args.name,
          firebaseId: firebaseId,
        },
      });

      const token = sign(
        { userId: user.id, role: args.role },
        process.env.TOKEN_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      return {
        token,
        user,
      };
    },

    login: async (
      parent: unknown,
      args: { email: string; password: string; role: string },
      context: GraphQLContext
    ) => {
      await signInWithEmailAndPassword(context.auth, args.email, args.password)
        .then((userCredential) => {})
        .catch((error) => {
          throw new Error(error);
        });

      const role = args.role;
      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (user === null) {
        throw new Error("User not found.");
      }

      switch (role) {
        case "TENANT":
          const tenant = await context.prisma.tenant.findUnique({
            where: { userId: user.id },
          });
          if (tenant === null) {
            throw new Error("Tenant profile not found.");
          }
          break;
        case "LANDLORD":
          const landlord = await context.prisma.landlord.findUnique({
            where: { userId: user.id },
          });
          if (landlord === null) {
            throw new Error("Landlord profile not found.");
          }
          break;
      }

      const token = sign(
        { userId: user.id, role: args.role },
        process.env.TOKEN_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      return {
        token,
        user,
      };
    }, */
/*     createTenant: async (
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

      const tenant = await context.prisma.tenant.create({
        data: {
          ...args,
          user: {
            connect: { id: context.session.user.id },
          },
        },
      });

      return tenant;
    }, */
/*     createLandlord: async (
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
    }, */
/*     createProperty: async (
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
    }, */
/*    createUnit: async (
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
    }, */
/*     createAnnouncement: async (
      parent: unknown,
      args: { title: string; body: string; propertyId: number },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const announcement = await context.prisma.announcement.create({
        data: {
          title: args.title,
          body: args.body,
          property: {
            connect: { id: args.propertyId },
          },
        },
      });

      return announcement;
    }, */
/*     updateTenant: async (
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
        context.session.currentRole !== Role.TENANT
      ) {
        throw new Error("Unauthenticated");
      }

      const tenant = await context.prisma.tenant.update({
        where: { id: args.id },
        data: {
          name: args.name,
          email: args.email,
          address: args.address,
          phoneNumber: args.phoneNumber,
        },
      });

      return tenant;
    }, */
/*     updateLandlord: async (
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
    }, */
/*     updateProperty: async (
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
    }, */
/*     updateUnit: async (
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
    }, */
/*     registerTenantToUnit: async (
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
    }, */
/*     updateAnnouncement: async (
      parent: unknown,
      args: { id: number; title: string; body: string },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new Error("Unauthenticated");
      }

      const announcement = await context.prisma.announcement.update({
        where: { id: args.id },
        data: {
          title: args.title,
          body: args.body,
        },
      });

      return announcement;
    }, */
/*     deleteTenant: async (
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

      const tenant = await context.prisma.tenant.delete({
        where: { id: args.id },
      });

      return true;
    }, */
/*     deleteLandlord: async (
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
    }, */
/*     deleteProperty: async (
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
    }, */
/* 
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
    }, */
/*     deleteAnnouncement: async (
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

      const announcement = await context.prisma.announcement.delete({
        where: { id: args.id },
      });

      return true;
    }, */
/*     updateBalance: async (
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
  },*/
/*   User: {
    id: (parent: User) => parent.id,
    email: (parent: User) => parent.email,
    username: (parent: User) => parent.username,
    firebaseId: (parent: User) => parent.firebaseId,
    tenantProfile: (parent: User, args: {}, context: GraphQLContext) => {
      return context.prisma.tenant.findUnique({
        where: { userId: parent.id },
      });
    },
    landlordProfile: (parent: User, args: {}, context: GraphQLContext) => {
      return context.prisma.landlord.findUnique({
        where: { userId: parent.id },
      });
    },
  }, */
/*   Tenant: {
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
  }, */
/*   Landlord: {
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
  }, */
/*   Property: {
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
 */
/*   Unit: {
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
  }, */
/*   Announcement: {
    id: (parent: Announcement) => parent.id,
    title: (parent: Announcement) => parent.title,
    body: (parent: Announcement) => parent.body,
    property: (parent: Announcement, args: {}, context: GraphQLContext) => {
      return context.prisma.property.findUnique({
        where: { id: parent.propertyId },
      });
    },
    date: (parent: Announcement) => parent.date,
  }, */
/*   Balance: {
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
}; */

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [
    AnnouncementSchema,
    BalanceSchema,
    LandlordSchema,
    PropertySchema,
    TenantSchema,
    UnitSchema,
    UserSchema,
  ],
});
