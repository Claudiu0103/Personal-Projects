import test, { APIRequestContext, expect } from "@playwright/test"
import { createAdminApiContext } from "../../utils/api-requests";
import { JsonData } from "../../utils/json-data";
import { MOST_WANTED_SONGS_URL, SEARCH_SONG_URL, SONGS_URL } from "../../utils/api-paths";
import { StatusCode } from "../../utils/status-code";

test.describe("Song CRUD Operation", () => {

    let apiContext: APIRequestContext;
    let song_id: number;

    test.beforeAll( async () => {
        apiContext = await createAdminApiContext();

        const response = await apiContext.post(SONGS_URL, {
            data: JsonData.postSongJson,
        });

        expect(response.status()).toBe(StatusCode.Success);
        const song = await response.json();
        expect(song.title).toBe(JsonData.postSongJson.title);
        song_id = song.id;
    });

    test.afterAll( async () => {
        if(song_id) {
            await apiContext.delete(`${SONGS_URL}/${song_id}`);
        }

        await apiContext.dispose();
    });

    test('Verify get list of songs contains the created song', async () => {
        const response = await apiContext.get(SONGS_URL);
        expect(response.status()).toBe(StatusCode.Success);
        const songs = await response.json();

        expect(Array.isArray(songs)).toBe(true);
        const foundSong = songs.find((s: any) => s.id === song_id);
        expect(foundSong.title).toBe(JsonData.postSongJson.title);
    });

    test('Verify find song by id', async () => {
        const response = await apiContext.get( `${SONGS_URL}/${song_id}`);

        expect(response.status()).toBe(StatusCode.Success);
        const song = await response.json();
        expect(song.id).toBe(song_id);
    });
    
    test('Verify if song by name exists', async() => {
        const response = await apiContext.get(SEARCH_SONG_URL, {
            params: { title: JsonData.postSongJson.title }
        });

        expect(response.status()).toBe(StatusCode.Success);
        const songs = await response.json();

        expect(Array.isArray(songs)).toBe(true);
        expect(songs.length).toBeGreaterThanOrEqual(1);
        const foundSong = songs.find((s: any) => s.id === song_id);
        expect(foundSong.title).toBe(JsonData.postSongJson.title);
    });

    test('Verify update song by id', async() => {
        const response = await apiContext.put(`${SONGS_URL}/${song_id}`, {
            data: JsonData.updateSongJson
        });

        expect(response.status()).toBe(StatusCode.Success);
        const song = await response.json();

        expect(song.id).toBe(song_id);
        expect(song.title).toBe(JsonData.updateSongJson.title);
        expect(song.duration).toBe(JsonData.updateSongJson.duration);
    });

    test('Verify get most wanted songs', async() => {
        const response = await apiContext.get(MOST_WANTED_SONGS_URL, {
            params: {limit: 10}
        });

        expect(response.status()).toBe(StatusCode.Success);
        const songs = await response.json();

        expect(Array.isArray(songs)).toBe(true);
        expect(songs.length).toBeGreaterThanOrEqual(10);
    });
})