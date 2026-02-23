export interface LoginData {
  email: string,
  password: string
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
}

export interface SongOperationData {
  title: string;
  duration: string;
  alternativeTitles: {
    title: string;
    language: string;
  }[];
  artistIds: number[];
}

export interface CreateAlbumData {
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
  label: string;
  artistName: string | null;
  songs: string[];
}

export interface CreatePlaylistData {
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
}

export interface BaseArtistData {
  type: 'Person' | 'Band';
  startDate: {
    year: string;
    month: string;
    day: string;
  };
  endDate?: {
    year: string;
    month: string;
    day: string;
  };
}

export interface PersonArtistData extends BaseArtistData {
  type: 'Person';
  personDetails: {
    firstName: string;
    lastName: string;
    stageName: string;
    birthDate: string;
  };
}

export interface BandArtistData extends BaseArtistData {
  type: 'Band';
  bandDetails: {
    bandName: string;
    location: string;
    members: string[];
  };
}

export type CreateArtistData = PersonArtistData | BandArtistData;


export interface PlaylistSimple {
  id: number;
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  owner: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface SearchData {
    query: string;
}
export type UpdateArtistData = PersonArtistData | BandArtistData;

export interface SearchData {
  query: string;
}

export interface UpdateAlbumData {
  title?: string;
  description?: string;
  genre?: string;
  releaseDate?: string;
  label?: string;
}

export interface Artist {
  id: number;
  type: string;
  name: string;
}

export interface ChangePasswordData{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest{
  oldPassword: string;
  newPassword: string
}

export interface CreatedAlbum {
    id: number;
    title: string;
}

export interface RegisterRequest{
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
}
