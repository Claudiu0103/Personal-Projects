import { UserSimple } from "./user-simple";

export interface User extends UserSimple {
    role:string;
    email:string;

  isDeleted: boolean;
}
