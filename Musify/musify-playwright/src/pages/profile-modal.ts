import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { ChangePasswordData } from "../utils/interface";
import { error } from "console";

export class ProfileModal {
    private readonly page: Page;
    private readonly fieldMap: Record<string, Locator>;

    private initialProfileData: {
        firstName?: string;
        lastName?: string;
        country?: string;
    } = {};

    private initialPassword: string = process.env.REGULAR_USER_PASSWORD || "None";

    constructor(page: Page) {
        this.page = page;
        this.fieldMap = {
            firstNameText: page.locator('p:has-text("First Name")'),
            lastNameText: page.locator('p:has-text("Last Name")'),
            countryText: page.locator('p.profile-name:has-text("Country")'),
            editProfileButton: page.locator('button:has-text("Edit Profile")'),
            changePasswordButton: page.locator('button:has-text("Change password")'),
            firstNameInput: page.locator('#editFirstName'),
            lastNameInput: page.locator('#editLastName'),
            countryInput: page.locator('#editCountry'),
            saveAction: page.locator('button:has-text("Save")'),
            cancelAction: page.locator('button:has-text("Cancel")'),
            currentPassword: page.locator('#currentPassword'),
            newPassword: page.locator("#newPassword"),
            confirmNewPassword: page.locator("#confirmNewPassword"),
            infoMessage: page.locator('p.info-message')
        };
    }

    async openChangePassword() : Promise<void>{
        await this.fieldMap.changePasswordButton.click();
    }
    
    async cancelAction() : Promise<void>{
        await this.fieldMap.cancelAction.click();
    }

    async openProfileEdit(): Promise<void> {
        await this.fieldMap.editProfileButton.click();
    }

    async updateProfile(): Promise<void> {
        await this.openProfileEdit();

        this.initialProfileData.firstName = await this.fieldMap.firstNameInput.inputValue();
        this.initialProfileData.lastName = await this.fieldMap.lastNameInput.inputValue();
        this.initialProfileData.country = await this.fieldMap.countryInput.inputValue();

        await this.fieldMap.firstNameInput.fill(this.initialProfileData.firstName + 'TEST');
        await this.fieldMap.lastNameInput.fill(this.initialProfileData.lastName + 'TEST');
        await this.fieldMap.countryInput.fill(this.initialProfileData.country + 'TEST');


        await this.fieldMap.saveAction.click();
    }

    async assertUpdateProfile(): Promise<void>{
        const actualFirstName=(await this.fieldMap.firstNameText.innerText()).split(':')[1].trim();
        expect(actualFirstName).toBe(this.initialProfileData.firstName+'TEST');

        const actualLastName=(await this.fieldMap.lastNameText.innerText()).split(':')[1].trim();
        expect(actualLastName).toBe(this.initialProfileData.lastName+'TEST');

        const actualCountry=(await this.fieldMap.countryText.innerText()).split(':')[1].trim();
        expect(actualCountry).toBe(this.initialProfileData.country+'TEST');
    }

    async revertUpdateProfile(): Promise<void> {
        await this.openProfileEdit();

        if(this.initialProfileData.firstName)
            await this.fieldMap.firstNameInput.fill(this.initialProfileData.firstName);

        if(this.initialProfileData.lastName)
            await this.fieldMap.lastNameInput.fill(this.initialProfileData.lastName);

        if(this.initialProfileData.country)
            await this.fieldMap.countryInput.fill(this.initialProfileData.country);

        await this.fieldMap.saveAction.click();
    }

    async changePassword(changePassword: ChangePasswordData){
        await this.openChangePassword();
        await this.fieldMap.currentPassword.fill(changePassword.currentPassword);
        await this.fieldMap.newPassword.fill(changePassword.newPassword);
        await this.fieldMap.confirmNewPassword.fill(changePassword.confirmPassword);
        await this.fieldMap.saveAction.click();
    }

    async assertInfoMessage(message:string){
        expect(await this.fieldMap.infoMessage.innerText()).toBe(message);
    }


}