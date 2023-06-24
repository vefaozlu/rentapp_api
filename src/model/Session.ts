import { User } from "@prisma/client";

export type Session = {
  user: User | null;
  currentRole: Role | null;
};

export enum Role {
  TENANT,
  LANDLORD,
  ADMIN,
}