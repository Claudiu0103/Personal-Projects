import { ArtistSimple } from "./artist-simple";

export interface Album{
    id:number;
    title:string;
    description:string;
    genre:string;
    releaseDate:string;
    label:string;
    artist:ArtistSimple;
}