import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "graphql-import-node";
import { sign } from "jsonwebtoken";
import { GraphQLContext } from "./context";
import typeDefs from "./schema.graphql";
import { Role } from "./model/Session";
import {
  User,
  Renter,
  Landlord,
  Property,
  Announcement,
  Prisma,
} from "@prisma/client";
require("dotenv").config();

const resolvers = {
  Query: {
    info: () => `This is the API of RentApp`,
    user: (parent: unknown, args: {}, context: GraphQLContext) => {
      if (context.session.user === null) {
        throw new Error("Unauthenticated");
      }

      return context.session.user;
    },
  },

  Mutation: {
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
        data: { email: args.email, name: args.name, firebaseId: firebaseId },
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
        case "RENTER":
          const renter = await context.prisma.renter.findUnique({
            where: { userId: user.id },
          });
          if (renter === null) {
            throw new Error("Renter profile not found.");
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
    },

    createRenter: async (
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

      const renter = await context.prisma.renter.create({
        data: {
          ...args,
          user: {
            connect: { id: context.session.user.id },
          },
        },
      });

      return renter;
    },

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

    createProperty: async (
      parent: unknown,
      args: {
        name: string;
        address: string;
        payPeriod: number;
        rentAmount: number;
        deposit: number;
        unit: string;
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

    createAnnouncement: async (
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
    },

    updateRenter: async (
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
        context.session.currentRole !== Role.RENTER
      ) {
        throw new Error("Unauthenticated");
      }

      const renter = await context.prisma.renter.update({
        where: { id: args.id },
        data: {
          name: args.name,
          email: args.email,
          address: args.address,
          phoneNumber: args.phoneNumber,
        },
      });

      return renter;
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

    updateProperty: async (
      parent: unknown,
      args: {
        id: number;
        name: string;
        address: string;
        payPeriod: number;
        rentAmount: number;
        deposit: number;
        unit: string;
        isVacant: boolean;
        renterId: number;
        landlordId: number;
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
          payPeriod: args.payPeriod,
          rentAmount: args.rentAmount,
          deposit: args.deposit,
          unit: args.unit,
          isVacant: args.isVacant,
          renter: {
            connect: { id: args.renterId },
          },
          landlord: {
            connect: { id: args.landlordId },
          },
        },
      });

      return property;
    },

    updateAnnouncement: async (
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
    },

    deleteRenter: async (
      parent: unknown,
      args: { id: number },
      context: GraphQLContext
    ) => {
      if (
        context.session.user === null ||
        context.session.currentRole !== Role.RENTER
      ) {
        throw new Error("Unauthenticated");
      }

      const renter = await context.prisma.renter.delete({
        where: { id: args.id },
      });

      return true;
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

    deleteAnnouncement: async (
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
    },
  },

  User: {
    id: (parent: User) => parent.id,
    email: (parent: User) => parent.email,
    name: (parent: User) => parent.name,
    firebaseId: (parent: User) => parent.firebaseId,
    renterProfile: (parent: User, args: {}, context: GraphQLContext) => {
      return context.prisma.renter.findUnique({
        where: { userId: parent.id },
      });
    },
    landlordProfile: (parent: User, args: {}, context: GraphQLContext) => {
      return context.prisma.landlord.findUnique({
        where: { userId: parent.id },
      });
    },
  },

  Renter: {
    id: (parent: Renter) => parent.id,
    name: (parent: Renter) => parent.name,
    email: (parent: Renter) => parent.email,
    address: (parent: Renter) => parent.address,
    phoneNumber: (parent: Renter) => parent.phoneNumber,
    propertiesRented: (parent: Renter, args: {}, context: GraphQLContext) => {
      return context.prisma.property.findMany({
        where: { renterId: parent.id },
      });
    },
  },

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

  Property: {
    id: (parent: Property) => parent.id,
    name: (parent: Property) => parent.name,
    address: (parent: Property) => parent.address,
    payPeriod: (parent: Property) => parent.payPeriod,
    rentAmount: (parent: Property) => parent.rentAmount,
    deposit: (parent: Property) => parent.deposit,
    unit: (parent: Property) => parent.unit,
    isVacant: (parent: Property) => parent.isVacant,
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
    renter: (parent: Property, args: {}, context: GraphQLContext) => {
      if (parent.isVacant) {
        return null;
      }
      return context.prisma.renter.findUnique({
        where: { id: parent.renterId! },
      });
    },
  },

  Announcement: {
    id: (parent: Announcement) => parent.id,
    title: (parent: Announcement) => parent.title,
    body: (parent: Announcement) => parent.body,
    property: (parent: Announcement, args: {}, context: GraphQLContext) => {
      return context.prisma.property.findUnique({
        where: { id: parent.propertyId },
      });
    },
    date: (parent: Announcement) => parent.date,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
