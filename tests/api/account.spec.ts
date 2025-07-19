// @ts-check
import { test, expect } from '@playwright/test';
import { createRandomUser } from '../support/utils'; 

test.describe('Account', () => {
    test('create a user', async ({ request }) => {
        // Generate random user credentials
        const { username, password } = createRandomUser();
        const createdUser = await request.post('/Account/v1/User', {
            data: {
                userName: username,
                password: password
            }
        });
        expect(createdUser).toBeOK();
    })
});