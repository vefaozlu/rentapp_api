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
  Scalars,
} from "./graphql/index";

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
    Scalars,
  ],
});
