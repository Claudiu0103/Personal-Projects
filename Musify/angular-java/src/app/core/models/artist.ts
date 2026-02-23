import { Person } from "./person";
import { Band } from "./band";
import { DateDTO } from "./dateDTO";
import { ArtistType } from "./enums/artist-type.enum";

export class Artist {
  id!: number;
  type!: ArtistType;
  startDate: DateDTO | null = null;
  endDate: DateDTO | null = null;
  person: Person | null = null;
  band: Band | null = null;

  constructor(value?: Partial<Artist>) {
    if (value) {
      Object.assign(this, value);

      if (value.person?.birthday) {
        value.person.birthday = new Date(value.person.birthday);
      }

      if (value.band?.members) {
        value.band.members = value.band.members.map(member => ({
          ...member,
          birthday: member.birthday ? new Date(member.birthday) : new Date(NaN)
        }));
      }

      if (value.startDate) {
        this.startDate = new DateDTO(value.startDate);
      }

      if (value.endDate) {
        this.endDate = new DateDTO(value.endDate);
      }
    }
  }

  public getName(): string {
    if (this.type == ArtistType.PERSON && this.person) {
      return this.person.stageName;
    }
    if (this.type == ArtistType.BAND && this.band) {
      return this.band.bandName;
    }
    return 'unknown artist';
  }
}