import { Person } from "./person";

export interface Band{
    id: number;
    bandName: string;
    location: string;
    members: Person[];
}