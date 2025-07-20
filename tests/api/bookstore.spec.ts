// @ts-check
import { test, expect } from '@playwright/test';
import { createRandomUser, createBasicAuth, createToken } from 'support/utils';

test.describe('BookStore APIs', () => {
    test('get list of books', async ({ request }) => {
        const response = await request.get('/BookStore/v1/Books');
        expect(response.status()).toBe(200);

        const bookList = await response.json();
        expect(bookList).toHaveProperty('books');

        expect(bookList.books.length).toBeGreaterThan(0);
        
        for (const book of bookList.books) {
            expect(book).toEqual(expect.objectContaining({
                isbn: expect.any(String),
                title: expect.any(String),
                subTitle: expect.any(String),
                author: expect.any(String),
                publish_date: expect.any(String),
                publisher: expect.any(String),
                pages: expect.any(Number),
                description: expect.any(String),
                website: expect.any(String)
            }));
        }
    });

    test('get specific book', async ({ request }) => {
        const isbn = '9781449365035';
        const response = await request.get(`/BookStore/v1/Book?ISBN=${isbn}`);
        expect(response.status()).toBe(200);
        
        expect(await response.json()).toEqual({
            "isbn": "9781449365035",
            "title": "Speaking JavaScript",
            "subTitle": "An In-Depth Guide for Programmers",
            "author": "Axel Rauschmayer",
            "publish_date": "2014-02-01T00:00:00.000Z",
            "publisher": "O'Reilly Media",
            "pages": 460,
            "description": "Like it or not, JavaScript is everywhere these days-from browser to server to mobile-and now you, too, need to learn the language or dive deeper than you have. This concise book guides you into and through JavaScript, written by a veteran programmer who o",
            "website": "http://speakingjs.com/"
        });
    });

    test.describe('under a user account', () => {
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

            // Create a token for the user
            const tokenObject = await createToken(username, password);
            ({ token } = tokenObject);

            // FOR TESTING: Log the created user details
            // console.log(`Created user: ${username}, Password: ${password}`);
            // console.log(`User ID: ${userId}, Basic Auth: ${basicAuth}, Token: ${token}`);
        });

        test('add a book to the user\'s collection', async ({ request }) => {
            const response = await request.post('/BookStore/v1/Books', {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    userId: userId,
                    collectionOfIsbns: [{ isbn: '9781449325862' }]
                }
            });
            expect(response.status()).toBe(201);
            expect(await response.json()).toEqual({
                "books": [
                    {
                        "isbn": "9781449325862"
                    }
                ]
            });
        });

        test('delete all books from the user\'s collection', async ({ request }) => {
            const addBookResponse = await request.post('/BookStore/v1/Books', {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    userId: userId,
                    collectionOfIsbns: [{ isbn: '9781449337711' }]
                }
            });
            expect(addBookResponse.status()).toBe(201);
            expect(await addBookResponse.json()).toEqual({
                "books": [
                    {
                        "isbn": "9781449337711"
                    }
                ]
            });

            const response = await request.delete(`/BookStore/v1/Books?UserId=${userId}`, {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            expect(response.status()).toBe(204);
        });

        test('delete a specific book from the user\'s collection', async ({ request }) => {
            const addBookResponse = await request.post('/BookStore/v1/Books', {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    userId: userId,
                    collectionOfIsbns: [{ isbn: '9781449337711' }, { isbn: '9781449325862' }]
                }
            });
            expect(addBookResponse.status()).toBe(201);
            expect(await addBookResponse.json()).toEqual({
                "books": [
                    {
                        "isbn": "9781449337711"
                    }, 
                    { 
                        "isbn": "9781449325862" 
                    }
                ]
            });

            const response = await request.delete('/BookStore/v1/Book', {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    "isbn": "9781449337711",
                    "userId": userId
                }
            });
            expect(response.status()).toBe(204);
        });

        test('replace a specific book from the user\'s collection', async ({ request }) => {
            const addBookResponse = await request.post('/BookStore/v1/Books', {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    userId: userId,
                    collectionOfIsbns: [{ isbn: '9781449337711' }]
                }
            });
            expect(addBookResponse.status()).toBe(201);
            expect(await addBookResponse.json()).toEqual({
                "books": [
                    {
                        "isbn": "9781449337711"
                    }
                ]
            });

            const bookToReplaceIsbn = '9781449337711';
            const response = await request.put(`/BookStore/v1/Books/${bookToReplaceIsbn}`, {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    "isbn": "9781449325862",
                    "userId": userId
                }
            });
            expect(response.status()).toBe(200);
            expect(await response.json()).toEqual({
                "userId": userId,
                "username": username,
                "books": [
                    {
                        "isbn": "9781449325862",
                        "title": "Git Pocket Guide",
                        "subTitle": "A Working Introduction",
                        "author": "Richard E. Silverman",
                        "publish_date": "2020-06-04T08:48:39.000Z",
                        "publisher": "O'Reilly Media",
                        "pages": 234,
                        "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git exp",
                        "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
                    }
                ]
            });
        });

        test.afterEach(async ({ request }) => {
            // Clean up created users
            const deleteResponse = await request.delete(`/Account/v1/User/${userId}`, {
                headers: {
                    authorization: basicAuth,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            expect(deleteResponse.status()).toBe(204);
        });
    })
});