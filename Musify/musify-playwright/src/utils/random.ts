import { faker } from '@faker-js/faker';

export function generateRandomInvalidEmail() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        randomString += letters[randomIndex];
    }
    
    return `${randomString}@.com`;
}
export function generateUniqueEmail() {
  const timestamp = Date.now();
  const email = faker.internet.email();
  const [localPart, domain] = email.split('@');
  return `${localPart}${timestamp}@${domain}`;
}

export function generateRandomPassword(length) {
  const lettersAndDigits = faker.string.alphanumeric(length - 2);
  const specialChars = '!@#$%^&*()_+[]{}';
  const specialChar1 = specialChars[Math.floor(Math.random() * specialChars.length)];
  const specialChar2 = specialChars[Math.floor(Math.random() * specialChars.length)];

  const fullPassword = lettersAndDigits + specialChar1 + specialChar2 + "12.$";

  // Shuffle pentru a amesteca caracterele
  return faker.helpers.shuffle([...fullPassword]).join('');
}