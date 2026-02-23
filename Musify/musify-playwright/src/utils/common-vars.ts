export class CommonVars {
    static readonly NOT_LOGGED_IN_STATE = './src/config/guestLoggedInState.json';
    static readonly REGULAR_USER_STATE = './src/config/regularLoggedInState.json';
    static readonly ADMIN_USER_STATE = './src/config/adminLoggedInState.json';

    static REGULAR_USER_EMAIL = process.env.REGULAR_USER_EMAIL!;
    static readonly REGULAR_USER_PASSWORD = process.env.REGULAR_USER_PASSWORD!;
    static readonly ADMIN_USER_EMAIL = process.env.ADMIN_USER_EMAIL!;
    static readonly ADMIN_USER_PASSWORD = process.env.ADMIN_USER_PASSWORD!;


}