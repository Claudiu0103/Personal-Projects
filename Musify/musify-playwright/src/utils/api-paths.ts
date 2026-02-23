export const DELETE_TEST_USERS = "/api/users/test-users";
export const DELETE_TEST_SONGS = "/api/songs/test-songs";
export const DELETE_TEST_ALBUMS = "/api/albums/test-albums";
export const DELETE_TEST_ARTISTS = "/api/artists/test-artists";

export const CREATE_TEST_PLAYLIST = '/api/playlists/create';
export const DELETE_TEST_PLAYLIST = '/api/playlists/delete/${playlistId}';
export const USERS_PLAYLIST ='/api/users';

export const ALBUMS_URL = '/api/albums'
export const SEARCH_ALBUM_URL = '/api/albums/search/'
export const SEARCH_ALBUM_BY_TITLE_URL = '/api/albums/search'
export const ALBUMS_DETAIL = '/api/albums/detail/'

export const ARTISTS_URL = '/api/artists';
export const ARTISTS_PERSONS_URL = '/api/artists/persons';
export const ARTISTS_SEARCH_URL = '/api/artists/search';
export const SEARCH_ARTIST_URL = ARTISTS_URL + "/search";

export const USERS_URL = "/api/users";
export const REGISTER = "/auth/register"
export const CHANGE_PASSWORD = "/api/users/change-password"

export const DELETE_TEST_PLAYLISTS = "/api/playlists/test-playlists";

export const SONGS_URL = "/api/songs";
export const SEARCH_SONG_URL = SONGS_URL + '/search';
export const MOST_WANTED_SONGS_URL = SONGS_URL + '/most-wanted';

export const PLAYLISTS_URL = "/api/playlists";
export const CREATE_PLAYLIST_URL = PLAYLISTS_URL + "/create";
export const OWNED_PLAYLISTS_URL = PLAYLISTS_URL + "/me/owned";
export const FOLLOWED_PLAYLISTS_URL = PLAYLISTS_URL + "/me/followed";
export const GET_PUBLIC_PLAYLISTS_URL = "/api/playlists/public";
export const FIND_PLAYLIST_BY_ID_URL = (id: number | string) => `/api/playlists/find/${id}`;
export const DELETE_PLAYLIST_BY_ID_URL = (id: number | string) => `/api/playlists/delete/${id}`;