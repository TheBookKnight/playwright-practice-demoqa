// @ts-check
import { test, expect } from '@playwright/test';
import { createRandomUser, createBasicAuth, createToken } from 'support/utils';

test.describe('Account APIs', () => {

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

    test.describe('with a user account', () => {
        let userId, username, password, basicAuth, token;
        test.beforeEach(async ({ request }) => {
            // Create a random user before running the tests and assign values
            ({username, password} = createRandomUser());

            const userNameResponse = await request.post('/Account/v1/User', {
                data: {
                    userName: username,
                    password: password
                }
            });

            expect(userNameResponse.status()).toBe(201);
            expect(await userNameResponse.json()).toEqual({
                "userID": expect.any(String),
                "username": expect.any(String),
                "books": []
            });

            const userNameResponseJson = await userNameResponse.json();
            userId = userNameResponseJson.userID;

            // Setup basic Auth for the user
            (basicAuth = await createBasicAuth(username, password));

            // Create a token for the user (unless testcase is for token generation)
            if (!test.info().title.includes('generate a user token')) {
                const tokenObject = await createToken(username, password);
                ({ token } = tokenObject);
            }

            // FOR TESTING: Log the created user details
            // console.log(`Created user: ${username}, Password: ${password}`);
            // console.log(`User ID: ${userId}, Basic Auth: ${basicAuth}, Token: ${token}`);
        });

        test('generate a user token', async ({ request}) => {
            const response = await request.post('/Account/v1/GenerateToken', {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    userName: username,
                    password: password
                }
            });
            expect(response.status()).toBe(200);
            expect(await response.json()).toEqual({
                "token": expect.any(String),
                "expires": expect.any(String),
                "status": "Success",
                "result": "User authorized successfully."
            });
            // Update the token variable for cleanup step
            ({ token } = await response.json());
        });

        test('gets a user profile data by user id', async ({ request }) => {
            const response = await request.get(`/Account/v1/User/${userId}`, {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            expect(response.status()).toBe(200);
            expect(await response.json()).toEqual({
                "userId": userId,
                "username": username,
                "books": []
            });
        })

        test('delete a user by user id', async ({ request }) => {
            const response = await request.delete(`/Account/v1/User/${userId}`, {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            expect(response.status()).toBe(204);
        });

        test.afterEach(async ({ request }) => {
            if(!test.info().title.includes('delete a user by user id')) {
                // Clean up created users
                const deleteResponse = await request.delete(`/Account/v1/User/${userId}`, {
                    headers: {
                        authorization: basicAuth,
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                expect(deleteResponse.status()).toBe(204);
            }
        });
    })
});