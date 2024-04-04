import { PubSub } from "graphql-subscriptions";
import { Announcement, Balance } from "@prisma/client";
import { TypedPubSub } from "typed-graphql-subscriptions";

export type PubSubChannels = {
  BALANCE: [{ tenantId: number, balance: Balance }];
  ANNOUNCEMENT: [{ tenantId: number, announcement: Announcement }];
};

export const pubSub = new TypedPubSub<PubSubChannels>(new PubSub());
