// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Student Game Library API',
    description: 'API for managing and viewing a collection of student favorite games.',
    version: '1.0.0'
  },
  host: 'localhost:3003', // will update for Render later
  schemes: ['http'],
  basePath: '/',
  definitions: {
    Game: {
      _id: '0001',
      title: 'Hollow Knight',
      platform: 'PC',
      genre: 'Metroidvania',
      rating: 'E10+',
      releaseDate: '2017-02-26',
      developer: 'Team Cherry',
      coverArt: 'https://upload.wikimedia.org/hollow_knight.jpg'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated.');
});
