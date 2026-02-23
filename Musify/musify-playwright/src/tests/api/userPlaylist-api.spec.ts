import { test, expect, APIRequestContext } from '@playwright/test';
import { createAdminApiContext } from '../../utils/api-requests';
import { JsonData } from '../../utils/json-data';
import { StatusCode } from '../../utils/status-code';
import {CREATE_TEST_PLAYLIST, DELETE_TEST_PLAYLIST, USERS_PLAYLIST} from '../../utils/api-paths';

test.describe('Playlist CRUD & Follow/Unfollow Tests', () => {
  let apiContext: APIRequestContext;
  let userId = 1;
  let playlistId: number;
  let playlistTitle: string;
  let createdPlaylists: number[] = [];

  test.beforeAll(async () => {
    apiContext = await createAdminApiContext();

    const createResponse = await apiContext.post(CREATE_TEST_PLAYLIST, {
      data: JsonData.postUserPlaylistJson, 
    });

    expect(createResponse.status()).toBe(StatusCode.Success);
    const playlist = await createResponse.json();
    playlistId = playlist.id;
    createdPlaylists.push(playlistId); 
  });

  test.afterAll(async () => {
    for (const playlistId of createdPlaylists) {
      try {
        await apiContext.delete(DELETE_TEST_PLAYLIST);
        console.log(`Deleted playlist ${playlistId}`);
      } catch (error) {
        console.warn(`Failed to delete playlist ${playlistId}:`, error);
      }
    }
    await apiContext.dispose();
  });
  

  test('Verify that the playlist is returned in the user s public playlists', async () => {
    const response = await apiContext.get(`${USERS_PLAYLIST}/${userId}/playlists?public=true`);
    expect(response.status()).toBe(StatusCode.Success);

    const playlists = await response.json();
    const found = playlists.find((p: any) => p.id === playlistId);
    expect(found).toBeDefined();
    expect(found.type).toBe('PUBLIC');
  });

  test('Verify that the playlist is not returned in private playlists', async () => {
    const response = await apiContext.get(`${USERS_PLAYLIST}/${userId}/playlists?public=false`);
    expect(response.status()).toBe(StatusCode.Success);

    const playlists = await response.json();
    const found = playlists.find((p: any) => p.id === playlistId);
    expect(found).toBeUndefined();
  });

  test('Verify that the playlist can be followed successfully', async () => {
    const response = await apiContext.post(`${USERS_PLAYLIST}/${userId}/playlists/follow/${playlistId}`);
    expect(response.status()).toBe(StatusCode.Success);
  });

  test('Verify that the followed playlist appears in the user s followed list', async () => {
 
    const response = await apiContext.get(`${USERS_PLAYLIST}/${userId}/playlists/followed`);
    expect(response.status()).toBe(StatusCode.Success);

    const playlists = await response.json();
    const found = playlists.find((p: any) => p.id === playlistId);
    expect(found).toBeDefined();
  });

  test('Verify that the user can unfollow the playlist', async () => {
    const followResponse = await apiContext.post(`${USERS_PLAYLIST}/${userId}/playlists/follow/${playlistId}`);
    expect(followResponse.status()).toBe(StatusCode.Success);

    const response = await apiContext.delete(`${USERS_PLAYLIST}/${userId}/playlists/unfollow/${playlistId}`);
    expect(response.status()).toBe(StatusCode.NoContent);
  });

  test('Verify that the playlist no longer appears in the followed list after unfollowing', async () => {
    const followResponse = await apiContext.post(`${USERS_PLAYLIST}/${userId}/playlists/follow/${playlistId}`);
    expect(followResponse.status()).toBe(StatusCode.Success);

    const unfollowResponse = await apiContext.delete(`${USERS_PLAYLIST}/${userId}/playlists/unfollow/${playlistId}`);
    expect(unfollowResponse.status()).toBe(StatusCode.NoContent);

    const response = await apiContext.get(`${USERS_PLAYLIST}/${userId}/playlists/followed`);
    expect(response.status()).toBe(StatusCode.Success);

    const playlists = await response.json();
    const found = playlists.find((p: any) => p.id === playlistId);
    expect(found).toBeUndefined();
  });
});