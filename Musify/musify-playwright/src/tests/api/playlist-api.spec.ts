import test, { APIRequestContext, expect } from "@playwright/test"
import { createAdminApiContext, getUserIdFromAdminState } from "../../utils/api-requests";
import { JsonData } from "../../utils/json-data";
import { SONGS_URL, PLAYLISTS_URL, ARTISTS_URL, ALBUMS_URL, SEARCH_ARTIST_URL, CREATE_PLAYLIST_URL, OWNED_PLAYLISTS_URL, FOLLOWED_PLAYLISTS_URL, USERS_URL, DELETE_PLAYLIST_BY_ID_URL, FIND_PLAYLIST_BY_ID_URL, GET_PUBLIC_PLAYLISTS_URL } from "../../utils/api-paths";
import { StatusCode } from "../../utils/status-code";

let apiContext: APIRequestContext;
let currentUser_id: number;

test.beforeAll(async () => {
    apiContext = await createAdminApiContext();

    currentUser_id = await getUserIdFromAdminState();
});

test.afterAll(async () => {
    await apiContext.dispose();
});

test.describe('Playlist CRUD Operations', () => {
    let playlistId: number;

    test.beforeAll(async () => {
        const response = await apiContext.post(CREATE_PLAYLIST_URL, {
            data: JsonData.postPlaylistJson,
        });

        expect(response.status()).toBe(StatusCode.Success);

        const playlist = await response.json();
        expect(playlist).toHaveProperty('id');
        expect(playlist.name).toBe(JsonData.postPlaylistJson.name);
        playlistId = playlist.id;
    });

    test.afterAll(async () => {
        if (playlistId) {
            const response = await apiContext.delete(DELETE_PLAYLIST_BY_ID_URL(playlistId));
            expect(response.status()).toBe(StatusCode.NoContent);
        }
    });

    test('Verify find playlist by ID', async () => {
        const response = await apiContext.get(FIND_PLAYLIST_BY_ID_URL(playlistId));
        expect(response.status()).toBe(StatusCode.Success);

        const playlist = await response.json();
        expect(playlist.id).toBe(playlistId);
        expect(playlist.name).toBe(JsonData.postPlaylistJson.name);
        expect(playlist.owner).toBeDefined();
    });

    test('Verify public playlists include the created one', async () => {
        const response = await apiContext.get(GET_PUBLIC_PLAYLISTS_URL);
        expect(response.status()).toBe(StatusCode.Success);

        const playlists = await response.json();
        expect(Array.isArray(playlists)).toBe(true);

        const found = playlists.find((pl: any) => pl.id === playlistId);
        expect(found).toBeDefined();
        expect(found.name).toBe(JsonData.postPlaylistJson.name);
    });

    test('Verify playlist is removed from public playlists after deletion', async () => {
        const deleteResponse = await apiContext.delete(DELETE_PLAYLIST_BY_ID_URL(playlistId));
        expect(deleteResponse.status()).toBe(StatusCode.NoContent);

        const publicResponse = await apiContext.get(GET_PUBLIC_PLAYLISTS_URL);
        expect(publicResponse.status()).toBe(StatusCode.Success);

        const playlists = await publicResponse.json();
        const exists = playlists.some((pl: any) => pl.id === playlistId);
        expect(exists).toBe(false);

        playlistId = undefined as unknown as number;
    });
});

test.describe("Playlists Add/Remove Songs Tests", () => {

    let artist_id: number;
    let album_id: number;
    let song_id: number;
    let playlist_id: number;

    test.beforeAll(async () => {
        //create test artist
        const artistToSave = {
            ...JsonData.validPostArtistJson,
            person: {
                ...JsonData.validPostArtistJson.person,
                stageName: `TestStageName ${new Date().toISOString()}`
            }
        };
        const responseArtist = await apiContext.post(ARTISTS_URL, {
            data: artistToSave
        });
        expect(responseArtist.status()).toBe(StatusCode.Success);
        const artist = await responseArtist.json();
        expect(artist.person.stageName).toBe(artistToSave.person.stageName);
        const responseArtistForId = await apiContext.get(SEARCH_ARTIST_URL, {
            params: { name: artist.person.stageName }
        });
        expect(responseArtistForId.status()).toBe(StatusCode.Success);
        const artists = await responseArtistForId.json();
        expect(artists.length).toBeGreaterThanOrEqual(1);
        artist_id = artists[0].id

        //create test song
        const responseSong = await apiContext.post(SONGS_URL, {
            data: JsonData.postSongJson
        });
        expect(responseSong.status()).toBe(StatusCode.Success);
        const song = await responseSong.json();
        expect(song.title).toBe(JsonData.postSongJson.title);
        song_id = song.id;

        //create test album
        const albumToSave = {
            ...JsonData.postAlbumJson,
            artistId: artist_id,
            songIdList: [song_id]
        };
        const responseAlbum = await apiContext.post(ALBUMS_URL, {
            data: albumToSave
        });
        expect(responseAlbum.status()).toBe(StatusCode.Success);
        const album = await responseAlbum.json();
        expect(album.title).toBe(albumToSave.title);
        album_id = album.id;

        //create test playlist
        const playlistToSave = {
            ...JsonData.postPlaylistJson,
            ownerId: currentUser_id
        };
        const responsePlaylist = await apiContext.post(CREATE_PLAYLIST_URL, {
            data: playlistToSave
        });
        expect(responsePlaylist.status()).toBe(StatusCode.Success);
        const playlist = await responsePlaylist.json();
        expect(playlist.name).toBe(playlistToSave.name);
        playlist_id = playlist.id;
    });

    test.afterAll(async () => {
        if (album_id) {
            await apiContext.delete(`${ALBUMS_URL}/${album_id}`);
        }
        if (artist_id) {
            await apiContext.delete(`${ARTISTS_URL}/${artist_id}`);
        }
        if (song_id) {
            await apiContext.delete(`${SONGS_URL}/${song_id}`);
        }
        if (playlist_id) {
            await apiContext.delete(`${PLAYLISTS_URL}/delete/${playlist_id}`);
        }
    });

    test('Verify if song can be added to playlist', async () => {
        const addSongJson = {
            songIds: [song_id],
            albumId: null
        }
        const response = await apiContext.post(`${PLAYLISTS_URL}/${playlist_id}/songs`, {
            data: addSongJson
        });
        expect(response.status()).toBe(StatusCode.Success);

        const responsePlaylistSongs = await apiContext.get(`${PLAYLISTS_URL}/${playlist_id}/songs`);
        expect(responsePlaylistSongs.status()).toBe(StatusCode.Success);
        const songs = await responsePlaylistSongs.json();
        expect(Array.isArray(songs)).toBe(true);
        expect(songs.length).toBeGreaterThanOrEqual(1);
        const foundSong = songs.find((s: any) => s.id === song_id);
        expect(foundSong.title).toBe(JsonData.postSongJson.title);
    });

    test('Verify if album can be added to playlist', async () => {
        const addAlbumJson = {
            songIds: null,
            albumId: album_id
        }

        const response = await apiContext.post(`${PLAYLISTS_URL}/${playlist_id}/songs`, {
            data: addAlbumJson
        });
        expect(response.status()).toBe(StatusCode.Success);

        const responsePlaylistSongs = await apiContext.get(`${PLAYLISTS_URL}/${playlist_id}/songs`);
        expect(responsePlaylistSongs.status()).toBe(StatusCode.Success);
        const songs = await responsePlaylistSongs.json();
        expect(Array.isArray(songs)).toBe(true);
        expect(songs.length).toBeGreaterThanOrEqual(1);
        const foundSong = songs.find((s: any) => s.id === song_id);
        expect(foundSong.title).toBe(JsonData.postSongJson.title);
    });

    test('Verify if song can be removed from playlist', async () => {
        const addSongJson = {
            songIds: [song_id],
            albumId: null
        }
        const response = await apiContext.post(`${PLAYLISTS_URL}/${playlist_id}/songs`, {
            data: addSongJson
        });
        expect(response.status()).toBe(StatusCode.Success);

        const responsePlaylistSongsBeforeDelete = await apiContext.get(`${PLAYLISTS_URL}/${playlist_id}/songs`);
        expect(responsePlaylistSongsBeforeDelete.status()).toBe(StatusCode.Success);
        const songsBeforeDelete = await responsePlaylistSongsBeforeDelete.json();
        expect(Array.isArray(songsBeforeDelete)).toBe(true);
        expect(songsBeforeDelete.length).toBeGreaterThanOrEqual(1);

        await apiContext.delete(`${PLAYLISTS_URL}/${playlist_id}/songs/${song_id}`);

        const responsePlaylistSongsAfterDelete = await apiContext.get(`${PLAYLISTS_URL}/${playlist_id}/songs`);
        expect(responsePlaylistSongsAfterDelete.status()).toBe(StatusCode.Success);
        const songsAfterDelete = await responsePlaylistSongsAfterDelete.json();
        expect(Array.isArray(songsAfterDelete)).toBe(true);
        expect(songsAfterDelete.length).toBe(0);
    });
});

test.describe("Playlists Owners and Followers Tests", () => {

    let playlist_id: number;

    test.beforeAll(async () => {
        //create test playlist
        const playlistToSave = {
            ...JsonData.postPlaylistJson,
            ownerId: currentUser_id
        };
        const responsePlaylist = await apiContext.post(CREATE_PLAYLIST_URL, {
            data: playlistToSave
        });
        expect(responsePlaylist.status()).toBe(StatusCode.Success);
        const playlist = await responsePlaylist.json();
        expect(playlist.name).toBe(playlistToSave.name);
        playlist_id = playlist.id;

        const responseFollowPlaylist = await apiContext.post(`${USERS_URL}/${currentUser_id}/playlists/follow/${playlist_id}`);
        expect(responseFollowPlaylist.status()).toBe(StatusCode.Success);
    });

    test.afterAll(async () => {
        if (playlist_id) {
            await apiContext.delete(`${PLAYLISTS_URL}/delete/${playlist_id}`);
        }
    });

    test('Verify if playlists owned by user are returned', async () => {
        const response = await apiContext.get(OWNED_PLAYLISTS_URL);
        expect(response.status()).toBe(StatusCode.Success);

        const playlists = await response.json();

        expect(Array.isArray(playlists)).toBe(true);
        expect(playlists.length).toBeGreaterThanOrEqual(1);
        const foundPlaylist = playlists.find((p: any) => p.id === playlist_id);
        expect(foundPlaylist.name).toBe(JsonData.postPlaylistJson.name);
    });

    test('Verify if playlists followed by user are returned', async () => {
        const response = await apiContext.get(FOLLOWED_PLAYLISTS_URL);
        expect(response.status()).toBe(StatusCode.Success);

        const playlists = await response.json();

        expect(Array.isArray(playlists)).toBe(true);
        expect(playlists.length).toBeGreaterThanOrEqual(1);
        const foundPlaylist = playlists.find((p: any) => p.id === playlist_id);
        expect(foundPlaylist.name).toBe(JsonData.postPlaylistJson.name);
    });

    test('Verify if followers of playlist are returned', async () => {
        const response = await apiContext.get(`${PLAYLISTS_URL}/${playlist_id}/followers`);
        expect(response.status()).toBe(StatusCode.Success);

        const followers = await response.json();

        expect(Array.isArray(followers)).toBe(true);
        expect(followers.length).toBeGreaterThanOrEqual(1);
        const foundFollower = followers.find((f: any) => f.id === currentUser_id);
    });
});