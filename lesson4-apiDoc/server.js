// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const db = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes under root / (routes/index.js attaches /contacts)
app.use('/', require('./routes'));

// --- Swagger/OpenAPI setup ---
// Let the server and Render clients know the public base URL via env BASE_URL
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Contacts API',
    version: '1.0.0',
    description: 'Contacts API - GET, POST, PUT, DELETE',
  },
  servers: [
    { url: baseUrl }
  ],
  components: {
    schemas: {
      Contact: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '61234abc...' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          favoriteColor: { type: 'string' },
          birthday: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/contacts': {
      get: {
        tags: ['contacts'],
        summary: 'Get all contacts',
        responses: {
          '200': {
            description: 'A list of contacts',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Contact' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['contacts'],
        summary: 'Create a contact',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  favoriteColor: { type: 'string' },
                  birthday: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Contact created',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { id: { type: 'string' } } }
              }
            }
          }
        }
      }
    },
    '/contacts/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      get: {
        tags: ['contacts'],
        summary: 'Get a contact by id',
        responses: {
          '200': { description: 'Contact object', content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } } },
          '404': { description: 'Not found' }
        }
      },
      put: {
        tags: ['contacts'],
        summary: 'Update a contact',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  favoriteColor: { type: 'string' },
                  birthday: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '204': { description: 'No Content - updated' },
          '404': { description: 'Not found' }
        }
      },
      delete: {
        tags: ['contacts'],
        summary: 'Delete a contact',
        responses: {
          '200': { description: 'Contact deleted' },
          '404': { description: 'Not found' }
        }
      }
    }
  }
};

const specs = swaggerJsdoc({ definition: swaggerDefinition, apis: [] });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health route
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Initialize DB then start server
db.initDb((err) => {
  if (err) {
    console.error('Failed to start due to DB init error:', err);
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(`Swagger UI available at ${baseUrl}/api-docs`);
    });
  }
});
