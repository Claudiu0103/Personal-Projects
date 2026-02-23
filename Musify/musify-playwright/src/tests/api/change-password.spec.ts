import {test, expect} from "@playwright/test";
import { APIRequestContext } from "@playwright/test";
import { createRegularApiContext, createRequestContext, registerAndGetToken } from "../../utils/api-requests";
import { generateRandomPassword } from "../../utils/random";
import { CHANGE_PASSWORD } from "../../utils/api-paths";
import { ChangePasswordData, ChangePasswordRequest } from "../../utils/interface";
import { StatusCode } from "../../utils/status-code";
import { ExpectMessage } from "../../utils/error-messages";
import { MockData } from "../../utils/mock-data";
test.describe('change-password', ()=>{
    let apiContext: APIRequestContext;

    test.beforeAll(async ({ playwright }) => {
        const token=await registerAndGetToken();
        apiContext = await createRequestContext(token);
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });

    test('verify fail change-password with same password', async()=>{
        let currentPassword=MockData.mockRegister.password;
        let changePasswordData:ChangePasswordRequest={
            oldPassword:currentPassword,
            newPassword:currentPassword
        }
        let response = await apiContext.put(CHANGE_PASSWORD, {
            data:changePasswordData
        });
        expect(JSON.parse((await response.text())).message).toBe(ExpectMessage.SamePassword);
        expect(response.status()).toBe(StatusCode.ConflictRequestError);
    })

    test('verify fail change-password with incorrect oldpassword', async()=>{
        let changePasswordData:ChangePasswordRequest={
            oldPassword:'AaaaAaaa1234.!a1',
            newPassword:'AbcdefAbcde12.!'
        }
        let response = await apiContext.put(CHANGE_PASSWORD, {
            data:changePasswordData
        });
        let responseObject=JSON.parse((await response.text()));
        expect(responseObject.message).toBe(ExpectMessage.WrongOldPassword);
        expect(responseObject.status).toBe(StatusCode.ConflictRequestError);
    })

    test('verify fail change-password with weak oldpassword', async()=>{
        let currentPassword=MockData.mockRegister.password;
        let changePasswordData:ChangePasswordRequest={
            oldPassword:currentPassword,
            newPassword:'1234'
        }
        let response = await apiContext.put(CHANGE_PASSWORD, {
            data:changePasswordData
        });
        let responseObject=JSON.parse(await response.text());
        expect(responseObject.message).toBe(ExpectMessage.WeakPassword);
        expect(responseObject.status).toBe(StatusCode.BadRequestError);
    })

    test('verify success change-password', async()=>{
        let currentPassword=MockData.mockRegister.password;
        let changePasswordData:ChangePasswordRequest={
            oldPassword:currentPassword,
            newPassword:generateRandomPassword(10)
        }
        let response = await apiContext.put(CHANGE_PASSWORD, {
            data:changePasswordData
        });
        let responseObject=JSON.parse(await response.text());
        expect(responseObject.status).toBe(ExpectMessage.Success);
    })
});