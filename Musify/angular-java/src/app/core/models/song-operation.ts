import { AlternativeTitle } from "./alternative-title";

export interface SongOperation {
  title: string;
  duration: string;
  alternativeTitles: AlternativeTitle[];
  artistIds: number[];
}
