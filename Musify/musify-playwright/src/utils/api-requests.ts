import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { DELETE_TEST_USERS, DELETE_TEST_SONGS, DELETE_TEST_ALBUMS, DELETE_TEST_ARTISTS, DELETE_TEST_PLAYLISTS, REGISTER } from "./api-paths";
import * as fs from 'fs';
import { generateUniqueEmail } from "./random";
import { RegisterRequest } from "./interface";
import { MockData } from "./mock-data";

export async function registerAndGetToken(): Promise<string> {
  const context = await request.newContext();

  const registerData: RegisterRequest = MockData.mockRegister;
  registerData.email = generateUniqueEmail();
  const response = await context.post(`${process.env.API_URL}/${REGISTER}`, { data: registerData });


  const body = await response.json();

  await context.dispose();

  if (!response.ok()) {
    throw new Error(`Register failed: ${JSON.stringify(body)}`);
  }

  return body.token;
}

export async function createRequestContext(token?: string): Promise<APIRequestContext> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return request.newContext({
    baseURL: process.env.API_URL,
    extraHTTPHeaders: headers,
  });
}

export async function createAdminApiContext(): Promise<APIRequestContext> {
  const state = JSON.parse(fs.readFileSync('./src/config/adminLoggedInState.json', 'utf-8'));
  const jwtCookie = state.cookies.find((cookie: any) => cookie.name === 'jwtToken');
  const token = jwtCookie?.value;

  if (!token) throw new Error('JWT token not found in admin state');

  return createRequestContext(token);
}

export async function createRegularApiContext(): Promise<APIRequestContext> {
  const state = JSON.parse(fs.readFileSync('./src/config/regularLoggedInState.json', 'utf-8'));
  const jwtCookie = state.cookies.find((cookie: any) => cookie.name === 'jwtToken');
  const token = jwtCookie?.value;

  if (!token) throw new Error('JWT token not found in regular state');

  return createRequestContext(token);
}

export function getUserIdFromAdminState(): number {
  const state = JSON.parse(fs.readFileSync('./src/config/adminLoggedInState.json', 'utf-8'));
  const jwtCookie = state.cookies.find((cookie: any) => cookie.name === 'jwtToken');
  const token = jwtCookie?.value;

  if (!token) throw new Error('JWT token not found in admin state');

  const payloadBase64 = token.split('.')[1];
  const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
  const payload = JSON.parse(payloadJson);

  if (!payload.id) throw new Error('User ID not found in JWT payload');

  return Number(payload.id);
}

export async function deleteResources(endpoint: string, resource: string, token?: string): Promise<void> {
  const apiContext = await createRequestContext(token);

  try {
    const response: APIResponse = await apiContext.delete(endpoint);
    if (!response.ok()) {
      const body = await response.text();
      console.warn(`Failed to delete ${resource}: ${response.status()} ${body}`);
    } else {
      console.log(`${resource} deleted via bulk endpoint`);
    }
  } finally {
    await apiContext.dispose();
  }
}

export async function deleteTestUsers(token?: string): Promise<void> {
  await deleteResources(DELETE_TEST_USERS, 'Test users', token);
}

export async function deleteTestSongs(token?: string): Promise<void> {
  await deleteResources(DELETE_TEST_SONGS, 'Test songs', token);
}

export async function deleteTestAlbums(token?: string): Promise<void> {
  await deleteResources(DELETE_TEST_ALBUMS, 'Test albums', token);
}

export async function deleteTestArtists(token?: string): Promise<void> {
  await deleteResources(DELETE_TEST_ARTISTS, 'Test artists', token);
}

export async function deleteTestPlaylists(token?: string): Promise<void> {
  await deleteResources(DELETE_TEST_PLAYLISTS, 'Test playlists', token);
}
