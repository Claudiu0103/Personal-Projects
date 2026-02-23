
import { unlink } from "fs/promises";
import { deleteTestAlbums, deleteTestArtists, deleteTestPlaylists, deleteTestSongs, deleteTestUsers } from "../utils/api-requests";
import { CommonVars } from "../utils/common-vars";
import path from "path";
import * as fs from 'fs/promises';

export default async function globalTeardown() {

    let adminToken: string | null = null;
    try {
        const adminStateContent = await fs.readFile(CommonVars.ADMIN_USER_STATE, 'utf-8');
        const adminState = JSON.parse(adminStateContent);
        const tokenCookie = adminState.cookies.find((c: any) => c.name === 'jwtToken');
        if (tokenCookie) {
            adminToken = tokenCookie.value;
        } 
    } catch (error) {
        console.warn('- Could not read admin auth state file. Skipping API cleanup.', error);
    }

    if(adminToken) {
        await deleteTestUsers(adminToken);
        await deleteTestSongs(adminToken);
        await deleteTestAlbums(adminToken);
        await deleteTestArtists(adminToken);
        await deleteTestPlaylists(adminToken);
    }

    try {
        const roles = ['guest', 'regular', 'admin'];
        for(const role of roles) {
            const file = path.resolve(__dirname, `${role}LoggedInState.json`);
            await unlink(file).catch(() => {});
        }
        console.log('Global teardown completed: storage state files removed.');
  } catch (e) {
    console.error('Error in global teardown:', e);
    throw e;
    }
}
