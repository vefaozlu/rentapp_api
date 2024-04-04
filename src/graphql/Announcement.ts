import { Announcement } from "@prisma/client";
import { GraphQLContext } from "../context";
import { Role } from "../model/Session";
import { GraphQLError } from "graphql";

export const AnnouncementSchema = {
  Announcement: {
    id: (parent: Announcement) => parent.id,
    title: (parent: Announcement) => parent.title,
    body: (parent: Announcement) => parent.body,
    date: (parent: Announcement) => parent.date,
    property: (parent: Announcement, args: {}, context: GraphQLContext) => {
      return context.prisma.property.findUnique({
        where: { id: parent.propertyId },
      });
    },
  },

  Mutation: {
    createAnnouncement: async (
      parent: unknown,
      args: { title: string; body: string; propertyId: number },
      context: GraphQLContext
    ) => {
      //  1

      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new GraphQLError("Unauthenticated", {
          extensions: { code: 401 },
        });
      }

      //  2

      try {
        const announcement = await context.prisma.announcement.create({
          data: {
            title: args.title,
            body: args.body,
            property: {
              connect: { id: args.propertyId },
            },
          },
        });

        const units = await context.prisma.unit.findMany({
          where: { propertyId: args.propertyId, tenantId: { not: null } },
        });

        units.forEach(async (unit) => {
          context.pubSub.publish("ANNOUNCEMENT", {
            tenantId: unit.tenantId!,
            announcement: announcement,
          });
        });

        //  Success

        return announcement;
      } catch (error) {
        //  Error

        throw new Error("Something went wrong");
      }
    },

    updateAnnouncement: async (
      parent: unknown,
      args: { id: number; title: string; body: string },
      context: GraphQLContext
    ) => {
      //  1

      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new GraphQLError("Unauthenticated", {
          extensions: { code: 401 },
        });
      }

      //  2

      try {
        const announcement = await context.prisma.announcement.update({
          where: { id: args.id },
          data: {
            title: args.title,
            body: args.body,
          },
        });

        //  Success

        return announcement;
      } catch (error) {
        //  Error

        throw new Error("Something went wrong");
      }
    },

    deleteAnnouncement: async (
      parent: unknown,
      args: { id: number },
      context: GraphQLContext
    ) => {
      //  1

      if (
        context.session.user === null ||
        context.session.currentRole !== Role.LANDLORD
      ) {
        throw new GraphQLError("Unauthenticated", {
          extensions: { code: 404 },
        });
      }

      //  2

      try {
        const announcement = await context.prisma.announcement.delete({
          where: { id: args.id },
        });

        //  Success

        return true;
      } catch (error) {
        //  Error

        throw new Error("Something went wrong");
      }
    },
  },
};
