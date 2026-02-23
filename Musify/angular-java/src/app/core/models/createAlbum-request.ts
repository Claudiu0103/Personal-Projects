export interface CreateAlbumRequest {
    title: string;
    description: string;
    genre: string;
    releaseDate: string;
    label: string;
    artistId: number | null;
    songIdList: number[];
}