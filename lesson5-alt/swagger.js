// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Student Game Library API',
    description: 'Games + wishlist API with OAuth and local auth'
  },
  host: process.env.SWAGGER_HOST || 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    cookieAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description: 'Session cookie. Authenticate using the /auth routes (login) first.'
    }
  },
  definitions: {
    Game: {
      title: 'Example Game',
      platform: 'PC',
      genre: 'Indie',
      rating: 'E',
      releaseDate: '2020-01-01',
      developer: 'Example Dev',
      coverArt: 'https://example.com/image.jpg'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('swagger-output.json generated');
});
// You can run this file with `node lesson5-alt/swagger.js` to generate swagger-output.json