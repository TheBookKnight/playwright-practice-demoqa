# Practice with Playwright 
Use this repo to practice with Playwright.

Target website for coverage: The Bookstore Application
https://demoqa.com/books

1. [Step 1: Install Playwright](#step-1-install-playwright)
2. [Step 2: Setup Config and Environment](#step-2-and-environment)

## Steps

### Step 1: Install Playwright 
Initialize Playwright Test framework

```
npx playwright init
```

Choose Typescript because:
- static type checking which helps catch type errors during compilation
- more toolling support with certain IDEs

### Step 2: Setup Config and Environment

Install [Playwright Visual Studio Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). 

Improves test scripting experience:
1. Debugging (and setting breakpoints)
2. Finding locators

#### playwright.config.ts

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

#### Setup Commands Directory

This will be for creating custom commands as abstraction.

Setup a `support` directory and a *utils.ts* file

We'll set it up with a method that creates a random username and password. We'll use the NPM Package [unique names generator](https://www.npmjs.com/package/unique-names-generator).

Use the custom method in the Account api spec so you can consistently create random users.