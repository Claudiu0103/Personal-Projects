import { SongSimple } from "./song-simple";
import { AlbumSimple } from "./album-simple";
import { ArtistSimple } from "./artist-simple";
import { Album } from "./album";

export interface SearchResponse{
    songs: SongSimple[],
    artists: ArtistSimple[],
    albums: Album[]
}