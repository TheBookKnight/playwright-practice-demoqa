# Practice with Playwright 
Use this repo to practice with Playwright.

Target website for coverage: The Bookstore Application
https://demoqa.com/books

## Steps

### Step 1: Install Playwright 
Initialize Playwright Test framework

```
npx playwright init
```

### Step 2: Setup Config and Environment

Install [Playwright Visual Studio Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). 

Improves test scripting experience:
1. Debugging (and setting breakpoints)
2. Finding locators

##### playwright.config.js

Setup [separate projects](https://playwright.dev/docs/test-projects#splitting-tests-into-projects). Right now, just one for the API test suite. 

1. It'll be under sub-directory `/tests/api/*`
2. It'll have base url `https://demoqa.com/swagger`
3. Create a spec and initialize one test for each bookstore and account requests.
    1. Get List of Books
    2. Create User
4. Setup test config parameter `reporter` with **list** and **html**
    1. **list** would output the results cleanly in terminal
    2. **html** would create a report webpage
4. Setup NPM test command using `npm run test` for running `npx playwright test`
4. Run API tests via `npm run test` to confirm they pass.
