import { AlbumSimple } from "./album-simple";
import { ArtistSimple } from "./artist-simple";

export class SongSimple {
    id: number;
    title: string;
    duration: string;
    album: AlbumSimple;
    artists: ArtistSimple[];

    constructor(data: {
        id: number;
        title: string;
        duration: string;
        album: AlbumSimple;
        artists: ArtistSimple[];
    }) {
        this.id = data.id;
        this.title = data.title;
        this.duration = data.duration;
        this.album = data.album;
        this.artists = data.artists;
    }

    getArtistNames(): string {
        return this.artists?.length ? this.artists.map(a => a.name).join(', ') : '-';
    }

    getAlbumTitle(): string {
        return this.album?.title ?? '-';
    }
}