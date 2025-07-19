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