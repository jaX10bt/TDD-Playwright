
import { test, expect, request } from '@playwright/test';

test.describe.skip('API Testing', () => {
    // Example of a POST request
    test('POST should get page elements', async ({ request }) => {
        const postData = {
            endDate: "2024-09-04",
            page: 1,
            page_size: 4,
            sorting: "created desc",
            startDate: "2022-09-03"
        };

        const response = await request.post('chats/ended', {
            data: postData,
        });


        // Assert that the response status is 201 (Created)
        expect(response.status()).toBe(200);

        // Parse the JSON response body
        const responseBody = await response.json();

        console.log(responseBody)
    });

});
