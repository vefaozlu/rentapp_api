import { User } from "@prisma/client";
import { GraphQLContext } from "../context";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { sign } from "jsonwebtoken";
import { Role } from "../model/Session";

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
    },
  },
};
