export class DateDTO {
  id!: number;
  year: number | null = null;
  month: number | null = null;
  day: number | null = null;

  constructor(value?: Partial<DateDTO>) {
    Object.assign(this, value);
  }

  public toString(): string {
    let output: string = '';
    if (this.day) {
      output += this.day + '/';
    }
    if (this.month) {
      output += this.month + '/';
    }
    if (this.year) {
      output += this.year;
    }
    return output;
  }

}