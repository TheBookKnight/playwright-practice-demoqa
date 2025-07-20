const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

/**
 * Create random username and password for testing.
 * @returns {Object} An object containing a random username and password.
 */
export const createRandomUser = () => {
  const randomUserName: string = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    separator: '',
    style: 'capital',
  });

  const username: string = `${randomUserName}${Math.floor(Math.random() * 1000)}`;
  const password: string = `${randomUserName}${Math.floor(Math.random() * 1000)}!`;
  return { username, password };
};

/**
 * Creates a Basic Auth header for the given username and password.
 * @param {string} username - The username for which to create the Basic Auth header.
 * @param {string} password - The password for which to create the Basic Auth header.
 * @returns {string} A Basic Auth header string.
 */
export const createBasicAuth = (username: string, password: string): string => {
  const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${base64Credentials}`;
};

/**
 * Creates token for authentication.
 * @param {string} username - The username for which to create the token.
 * @param {string} password - The password for which to create the token.
 * @returns {Object} An object containing token, expiration, status, and result
 */
export const createToken = async (username: string, password: string) => {
  const response = await fetch('https://demoqa.com/Account/v1/GenerateToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName: username, password: password }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create token: ${response.statusText}`);
  }

  return await response.json();
};