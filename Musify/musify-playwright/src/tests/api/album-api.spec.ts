import { test, expect, APIRequestContext } from '@playwright/test';
import { createAdminApiContext } from '../../utils/api-requests';
import { StatusCode } from '../../utils/status-code';
import { ALBUMS_DETAIL, ALBUMS_URL, SEARCH_ALBUM_BY_TITLE_URL, SEARCH_ALBUM_URL } from '../../utils/api-paths';
import { CreatedAlbum } from '../../utils/interface';
import { JsonData } from '../../utils/json-data';

let createdAlbums: CreatedAlbum[] = [];

test.describe('Album CRUD Operation', () => {
    let apiContext: APIRequestContext;
    test.beforeAll(async () => {
        apiContext = await createAdminApiContext();

        for (let i = 0; i < 3; i++) {
            const uniqueTitle = `${JsonData.baseAlbumJson.title}_${Date.now()}_${i}`;
            const newAlbum = { ...JsonData.baseAlbumJson, title: uniqueTitle };
            const response = await apiContext.post(ALBUMS_URL, { data: newAlbum });
            expect(response.status()).toBe(StatusCode.Success);
            const created = await response.json();
            createdAlbums.push({ id: created.id, title: uniqueTitle });
        }
    });

    test.afterAll(async () => {
        for (const album of createdAlbums) {
            await apiContext.delete(`${ALBUMS_URL}/${album.id}`);
        }
        await apiContext.dispose();
    });

    test('Verify if user is able to add an album with valid data', async () => {
        const response = await apiContext.post(ALBUMS_URL, { data: JsonData.baseAlbumJson });
        expect(response.status()).toBe(StatusCode.Success);
        const album = await response.json();
        expect(album.genre).toBe('Rock');
        createdAlbums.push({ id: album.id, title: album.title });
    });

    test('Verify GET /api/albums returns created albums when filtered by title', async () => {
        const response = await apiContext.get(ALBUMS_URL);
        expect(response.status()).toBe(StatusCode.Success);
        const albums = await response.json();
        const filtered = albums.filter((a: any) =>
            createdAlbums.some(ca => ca.title === a.title)
        );
        expect(filtered.length).toBe(createdAlbums.length);
    });

    test('Verify that updating album details works successfully', async () => {
        const albumId = createdAlbums[0].id;
        const updateResponse = await apiContext.put(`${ALBUMS_DETAIL}${albumId}`, {
            data: {
                description: 'Updated description',
                genre: 'Rock',
                releaseDate: '2021-02-02',
                label: 'Updated Label'
            }
        });
        expect(updateResponse.status()).toBe(StatusCode.Success);
        const updatedAlbum = await updateResponse.json();
        expect(updatedAlbum.description).toBe('Updated description');
        expect(updatedAlbum.genre).toBe('Rock');
        expect(updatedAlbum.label).toBe('Updated Label');
    });

    test('Verify that searching albums by title returns correct results', async () => {
        const searchTitle = createdAlbums[1].title;
        const searchResponse = await apiContext.get(`${SEARCH_ALBUM_BY_TITLE_URL}?title=${searchTitle}`);
        expect(searchResponse.status()).toBe(StatusCode.Success);
        const albums = await searchResponse.json();
        expect(albums.some((a: any) => a.title === searchTitle)).toBe(true);
    });

    test('Verify that getting album by ID returns the correct album', async () => {
        const albumId = createdAlbums[2].id;
        const getResponse = await apiContext.get(`${SEARCH_ALBUM_URL}${albumId}`);
        expect(getResponse.status()).toBe(StatusCode.Success);
        const album = await getResponse.json();
        expect(album.id).toBe(albumId);
        expect(album.title).toBe(createdAlbums[2].title);
    });
});
