import { AlbumSimple } from "./album-simple";
import { ArtistSimple } from "./artist-simple";
import { AlternativeTitle } from "./alternative-title";

export class Song {
    id: number;
    title: string;
    duration: string;
    album: AlbumSimple;
    artists: ArtistSimple[];
    alternativeTitles: AlternativeTitle[];

    constructor(data: {
        id: number;
        title: string;
        duration: string;
        album: AlbumSimple;
        artists: ArtistSimple[];
        alternativeTitles: AlternativeTitle[];
    }) {
        this.id = data.id;
        this.title = data.title;
        this.duration = data.duration;
        this.album = data.album;
        this.artists = data.artists;
        this.alternativeTitles = data.alternativeTitles;
    }

    getArtistNames(): string {
        return this.artists?.length ? this.artists.map(a => a.name).join(', ') : '-';
    }

    getAlbumTitle(): string {
        return this.album?.title ?? '-';
    }
}