import fastify from 'fastify';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import scalarApiReference from '@scalar/fastify-api-reference';
import { uploadRoutes } from './routes/uploadRoutes';

export const buildServer = async () => {
  const app = fastify({ logger: true });

  // 1. Register Swagger for OpenAPI specification
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Massive Streaming API',
        description: 'Capstone Project Massive Streaming API Documentation',
        version: '1.0.0'
      }
    }
  });

  // 2. Register SCALAR for the API Reference UI
  await app.register(scalarApiReference, {
    routePrefix: '/reference',
    configuration: {
      theme: 'purple', // You can customize the theme
    }
  });

  // 3. Register plugin to handle file streaming (multipart/form-data)
  app.register(multipart);

  // 4. Register routes (encapsulated)
  app.register(uploadRoutes, { prefix: '/api' });

  return app;
};

// If this file is executed directly, start the server
if (require.main === module) {
  const start = async () => {
    try {
      const app = await buildServer();
      await app.listen({ port: 3000 });
      console.log('🚀 Server running on http://localhost:3000');
      console.log('📚 API Documentation available at http://localhost:3000/reference');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  start();
}