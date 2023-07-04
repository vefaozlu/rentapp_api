import { PubSub } from "graphql-subscriptions";
import { Balance } from "@prisma/client";
import { TypedPubSub } from "typed-graphql-subscriptions";

export type PubSubChannels = {
  BALANCE: [{ tenantId: number, balance: Balance }];
};

export const pubSub = new TypedPubSub<PubSubChannels>(new PubSub());
