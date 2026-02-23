import { UserRoleType } from "./enums/user-role.enum";

export interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  role: UserRoleType;
  isDeleted: boolean;
}
