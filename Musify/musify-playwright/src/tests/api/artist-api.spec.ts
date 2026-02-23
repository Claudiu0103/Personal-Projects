import { test, expect } from '@playwright/test';
import { JsonData } from '../../utils/json-data';
import { APIRequestContext } from '@playwright/test';
import { createAdminApiContext } from '../../utils/api-requests';
import { Functions } from '../../utils/functions';
import { ARTISTS_URL, ARTISTS_PERSONS_URL, ARTISTS_SEARCH_URL } from '../../utils/api-paths';
import { StatusCode } from '../../utils/status-code';

test.describe("Artist API tests", () => {

    let apiContext: APIRequestContext;
    let seededArtists: any[] = [];

    test.beforeAll(async () => {
        apiContext = await createAdminApiContext();

        for (let i = 0; i < 5; i++) {
            const artistName = `TestArtist_${i}_${Functions.generateRandomNumber()}`;

            const artistJson = JSON.parse(JSON.stringify(JsonData.validPostArtistJson));
            artistJson.person.stageName = artistName;
            const response = await apiContext.post(ARTISTS_URL, {
                data: artistJson
            });

            expect(response.status()).toBe(StatusCode.Success);
            const artist = await response.json();
            seededArtists.push(artist);
        }
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });

    test('GET list of artists', async () => {
        const response = await apiContext.get(ARTISTS_URL);
        expect(response.status()).toBe(StatusCode.Success);

        const artists = await response.json();

        const matched = artists.filter(artist =>
            seededArtists.some(seed =>
                seed.person?.stageName === artist.name
            )
        );

        expect(matched.length).toBe(seededArtists.length);
    });

    test('GET list of artist persons', async () => {
        const response = await apiContext.get(ARTISTS_PERSONS_URL);
        expect(response.status()).toBe(StatusCode.Success);

        const persons = await response.json();

        const matched = persons.filter(person =>
            seededArtists.some(seed =>
                seed.person.stageName === person.stageName
            )
        );

        expect(matched.length).toBe(seededArtists.length);
    });

    test.describe('POST artist', () => {
        test('POST artist with valid data', async () => {
            const response = await apiContext.post(ARTISTS_URL, {
                data: JsonData.validPostArtistJson,
            });

            expect(response.status()).toBe(StatusCode.Success);
            const artist = await response.json();

            expect(artist.type).toBe(JsonData.validPostArtistJson.type);
            expect(artist.person.stageName).toBe(JsonData.validPostArtistJson.person.stageName)
            seededArtists.push(JsonData.validPostArtistJson)
        });

        test('POST artist with invalid data', async () => {
            const response = await apiContext.post(ARTISTS_URL, {
                data: JsonData.invalidPostArtistJson,
            });

            expect(response.status()).toBe(StatusCode.BadRequestError);
        });

    });

    test.describe('GET artist by id', () => {
        test('GET artist by id with valid id', async () => {
            const response = await apiContext.get(ARTISTS_URL);
            expect(response.status()).toBe(StatusCode.Success);

            const artists = await response.json();
            const firstArtistId = artists[0].id;
            const firstArtistType = artists[0].type;

            const responseArtist = await apiContext.get(`${ARTISTS_URL}/${firstArtistId}`);
            expect(responseArtist.status()).toBe(StatusCode.Success);

            const artist = await responseArtist.json();
            expect(artist.id).toBe(firstArtistId);
            expect(artist.type).toBe(firstArtistType);

        });

        test('GET artist by id with invalid id', async () => {
            const response = await apiContext.get(`${ARTISTS_URL}/${-1}`);
            expect(response.status()).toBe(StatusCode.NotFound);
        });
    })

    test.describe('PUT artist on id', () => {
        test('PUT artist on id with valid data', async () => {
            const response = await apiContext.get(ARTISTS_URL);
            expect(response.status()).toBe(StatusCode.Success);

            const artists = await response.json();
            const firstArtistId = artists[0].id;

            const getResponse = await apiContext.get(`${ARTISTS_URL}/${firstArtistId}`);
            const artist = await getResponse.json();
            var newName;
            if (artist.person) {
                newName = Functions.switchName(artist.person.stageName)
                artist.person.stageName = newName;
            }
            if (artist.band) {
                newName = Functions.switchName(artist.band.name)
                artist.band.name = newName;
            }

            const putResponse = await apiContext.put(`${ARTISTS_URL}/${firstArtistId}`, {
                data: artist
            });
            expect(putResponse.status()).toBe(StatusCode.Success);
            const updatedArtist = await putResponse.json();
            if (updatedArtist.person) {
                expect(updatedArtist.person.stageName).toBe(newName);
            }
            if (updatedArtist.band) {
                expect(updatedArtist.band.name).toBe(newName);
            }
        });

        test('PUT artist on id with invalid id', async () => {
            const response = await apiContext.get(ARTISTS_URL);
            expect(response.status()).toBe(StatusCode.Success);

            const artists = await response.json();
            const firstArtistId = artists[0].id;

            const getResponse = await apiContext.get(`${ARTISTS_URL}/${firstArtistId}`);
            const artist = await getResponse.json();

            const putResponse = await apiContext.put(`${ARTISTS_URL}/${-1}`, {
                data: artist
            });
            expect(putResponse.status()).toBe(StatusCode.NotFound);

        });

        test('PUT artist on id with invalid data', async () => {
            const response = await apiContext.get(ARTISTS_URL);
            expect(response.status()).toBe(StatusCode.Success);

            const artists = await response.json();

            const firstArtistId = artists[0].id;

            const getResponse = await apiContext.get(`${ARTISTS_URL}/${firstArtistId}`);
            const artist = await getResponse.json();

            const oldType = artist.type;

            artist.type = 'DOG';

            const putResponse = await apiContext.put(`${ARTISTS_URL}/${firstArtistId}`, {
                data: artist
            });
            expect(putResponse.status()).toBe(StatusCode.Success);
            const updatedArtist = await putResponse.json();
            expect(updatedArtist.type).toBe(oldType);

        });
    })

    test.describe('GET list of artist songs', () => {
        test('GET list of artist songs with valid artist id', async () => {
            const response = await apiContext.get(ARTISTS_URL);
            expect(response.status()).toBe(StatusCode.Success);

            const artists = await response.json();

            const firstArtistId = artists[0].id;

            const responseSongs = await apiContext.get(`${ARTISTS_URL}/${firstArtistId}/songs`);
            expect(responseSongs.status()).toBe(StatusCode.Success);

            const songs = await responseSongs.json();
            expect(Array.isArray(songs)).toBe(true);
            if (songs.length > 0) {
                expect(songs[0].id).not.toBe(null);
                expect(songs[0].title).not.toBe('');
            }
        });

        test('GET list of artist songs with invalid artist id', async () => {
            const response = await apiContext.get(`${ARTISTS_URL}/${-1}/songs`);
            expect(response.status()).toBe(StatusCode.NotFound);
        });
    })

    test.describe('GET list of artist albums', () => {
        test('GET list of artist albums with valid artist id', async () => {
            const response = await apiContext.get(ARTISTS_URL);
            expect(response.status()).toBe(StatusCode.Success);

            const artists = await response.json();

            const firstArtistId = artists[0].id;

            const responseAlbums = await apiContext.get(`${ARTISTS_URL}/${firstArtistId}/albums`);
            expect(responseAlbums.status()).toBe(StatusCode.Success);

            const albums = await responseAlbums.json();
            expect(Array.isArray(albums)).toBe(true);

            if (albums.length > 0) {
                expect(albums[0].id).not.toBe(null);
                expect(albums[0].title).not.toBe('');
            }

        });

        test('GET list of artist albums with invalid artist id', async () => {
            const response = await apiContext.get(`${ARTISTS_URL}/${-1}/albums`);
            expect(response.status()).toBe(StatusCode.NotFound);
        });
    })

    test('GET result for searching artist using existing name', async() => {
        const searchName = seededArtists[0].person.stageName;
        const response = await apiContext.get(`${ARTISTS_SEARCH_URL}?name=${searchName}`);
        expect(response.status()).toBe(StatusCode.Success);
        const artists = await response.json();
        expect(artists.some((a: any) => a.name === searchName)).toBe(true);
    })
})