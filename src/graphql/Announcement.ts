import { Announcement } from "@prisma/client";
import { GraphQLContext } from "../context";
import { Role } from "../model/Session";

export const AnnouncementSchema = {
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

  Mutation: {
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
        
        return announcement;
      } catch (error) {
        throw new Error("Something went wrong");
      }
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
};
