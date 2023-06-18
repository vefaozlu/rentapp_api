import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "graphql-import-node";
import { sign } from "jsonwebtoken";
import { GraphQLContext } from "./context";
import typeDefs from "./schema.graphql";
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
      if (context.currentUser === null) {
        throw new Error("Unauthenticated");
      }

      return context.currentUser;
    },
  },

  Mutation: {
    signup: async (
      parent: unknown,
      args: { email: string; password: string; name: string },
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

      const token = sign({ userId: user.id }, process.env.TOKEN_SECRET!, {
        expiresIn: "1d",
      });

      return {
        token,
        user,
      };
    },

    login: async (
      parent: unknown,
      args: { email: string; password: string },
      context: GraphQLContext
    ) => {
      await signInWithEmailAndPassword(context.auth, args.email, args.password)
        .then((userCredential) => {})
        .catch((error) => {
          throw new Error(error);
        });

      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (user === null) {
        throw new Error("User not found.");
      }

      const token = sign({ userId: user.id }, process.env.TOKEN_SECRET!, {
        expiresIn: "1d",
      });

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
      if (context.currentUser === null) {
        throw new Error("Unauthenticated");
      }

      const renter = await context.prisma.renter.create({
        data: {
          ...args,
          user: {
            connect: { id: context.currentUser.id },
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
      if (context.currentUser === null) {
        throw new Error("Unauthenticated");
      }

      const landlord = await context.prisma.landlord.create({
        data: {
          ...args,
          user: {
            connect: { id: context.currentUser.id },
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
      if (context.currentUser === null) {
        throw new Error("Unauthenticated");
      }

      const property = await context.prisma.property.create({
        data: {
          ...args,
          landlord: {
            connect: { id: context.currentUser.id },
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
      if (context.currentUser === null) {
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
