import { FastifyInstance } from 'fastify';
import { handleUpload } from '../controllers/uploadController';

export async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post('/upload', {
    schema: {
      summary: 'Upload Massive File',
      description: 'Receives a file via multipart/form-data, processes it as a stream to protect RAM, and dispatches a background job via BullMQ.',
      tags: ['File Processing'],
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          file: { 
            type: 'string', 
            format: 'binary' 
          } 
        },
        required: ['file']
      },
      response: {
        202: {
          description: 'File accepted and processing in background',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Bad Request - No file provided',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        406: {
          description: 'Not Acceptable - Missing multipart header',
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' },
            statusCode: { type: 'number' }
          }
        }
      }
    },
    validatorCompiler: () => () => true
  }, handleUpload);
}