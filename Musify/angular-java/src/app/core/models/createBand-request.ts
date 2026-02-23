import { CreatePersonRequest } from "./createPerson-request";

export interface CreateBandRequest {
  bandName: string;
  location: string;
  members: CreatePersonRequest[];
}