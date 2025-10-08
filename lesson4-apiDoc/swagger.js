// swagger/swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'Contacts API documentation with Swagger for CSE341 Lesson 4'
  },
  host: 'localhost:3002', // This will change automatically in production if BASE_URL is used
  schemes: ['http', 'https'],
  definitions: {
    Contact: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      favoriteColor: 'Blue',
      birthday: '1990-01-01'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; // entry point to your routes

swaggerAutogen(outputFile, endpointsFiles, doc);
