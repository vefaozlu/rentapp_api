import { GraphQLScalarType } from "graphql";

export const Scalars = {
  NonEmptyString: new GraphQLScalarType({
    name: "NonEmpytString",
    description: "String that cannot be empty",
    serialize: (value: unknown): string => {
      if (typeof value !== "string") {
        throw new Error("NonEmpytString can only be used with string");
      }

      return value;
    },
    parseValue: (value: unknown): string => {
      if (typeof value !== "string" || value === "") {
        throw new Error("NonEmpytString can only be used with string");
      }

      return value;
    },
  }),

  EmailString: new GraphQLScalarType({
    name: "EmailString",
    description: "String that must be a valid email address",
    serialize: (value: unknown): string => {
      if (typeof value !== "string") {
        throw new Error("EmailString can only be used with string");
      }

      return value;
    },
    parseValue: (value: unknown): string => {
      var format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (typeof value !== "string" || value.match(format) === null) {
        throw new Error("Please enter a valid email");
      }

      return value;
    },
  }),
};
