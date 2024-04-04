import { User } from "@prisma/client";
import { GraphQLContext } from "../context";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { sign } from "jsonwebtoken";
import { Role } from "../model/Session";
import { GraphQLError } from "graphql";

export const UserSchema = {
  User: {
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
  },

  Query: {
    info: () => `This is the API of RentApp`,
    user: (parent: unknown, args: {}, context: GraphQLContext) => {
      if (context.session.user === null) {
        throw new Error("Unauthenticated");
      }

      return context.session.user;
    },

    profile: (parent: unknown, args: {}, context: GraphQLContext) => {
      //  1

      if (context.session.user === null) {
        throw new GraphQLError("Unauthenticated", {
          extensions: { code: 401 },
        });
      }

      //  2

      const profile =
        context.session.currentRole === Role.LANDLORD
          ? context.prisma.landlord.findUnique({
              where: { userId: context.session.user.id },
            })
          : context.prisma.tenant.findUnique({
              where: { userId: context.session.user.id },
            });

      const user = context.session.user;
      const role = context.session.currentRole;

      //  Success

      return {
        user,
        profile,
        role,
      };
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
        data: {
          email: args.email,
          username: args.name,
          firebaseId: firebaseId,
        },
      });

      const token = sign(
        { userId: user.id, role: args.role },
        process.env.TOKEN_SECRET!
        /*         {
          expiresIn: "1d",
        } */
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
      const role = args.role;

      //  1

      await signInWithEmailAndPassword(context.auth, args.email, args.password)
        .then((userCredential) => {})
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            throw new GraphQLError("Wrong password", {
              extensions: { code: 401 },
            });
          }
          if (error.code === "auth/wrong-email") {
            throw new GraphQLError("Invalid email", {
              extensions: { code: 401 },
            });
          }
          if (error.code === "auth/user-not-found") {
            throw new GraphQLError("User not found", {
              extensions: { code: 404 },
            });
          }
        });

      //  2

      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (user === null) {
        throw new GraphQLError("User not found", { extensions: { code: 404 } });
      }

      //  3

      const profile =
        role == "LANDLORD"
          ? await context.prisma.landlord.findUnique({
              where: { userId: user.id },
            })
          : await context.prisma.tenant.findUnique({
              where: { userId: user.id },
            });

      //  4

      if (!profile) {
        throw new Error("Profile not found");
      }

      //  5

      const token = sign(
        { userId: user.id, role: args.role },
        process.env.TOKEN_SECRET!
        /*         {
          expiresIn: "1d",
        } */
      );

      //  Succcess

      return {
        token,
        user,
      };
    },

    registerUserToTenantProfile: async (
      parent: unknown,
      args: {
        email: string;
        name: string;
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

      const tenant = await context.prisma.tenant.findFirst({
        where: {
          OR: [{ email: args.email }, { phoneNumber: args.phoneNumber }],
          AND: { name: args.name },
        },
      });

      if (tenant === null) {
        throw new Error(
          "Your records not found. Please contact your association owner."
        );
      }

      //  3

      await context.prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          user: {
            connect: {
              id: context.session.user.id,
            },
          },
        },
      });

      //  Success

      return tenant;
    },
  },
};
