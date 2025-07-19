// @ts-check
import { test, expect } from '@playwright/test';

test.describe('BookStore', () => {
    test('get list of books', async ({ request }) => {
        const books = await request.get('/BookStore/v1/Books');
        expect(books).toBeOK();
    })
});