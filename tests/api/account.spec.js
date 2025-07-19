// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Account', () => {
    test('create a user', async ({ request }) => {
        const createdUser = await request.post('/Account/v1/User', {
            data: {
                userName: 'randomUser1357',
                password: 'Test@1357'
            }
        });
        expect(createdUser).toBeOK();
    })
});