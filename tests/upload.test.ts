/// <reference types="jest" />

import request from 'supertest';
import { buildServer } from '../src/server';
import { FastifyInstance } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';

// Mock BullMQ to prevent real Redis connections during tests
jest.mock('bullmq', () => {
  return {
    Queue: jest.fn().mockImplementation(() => ({
      add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
      close: jest.fn().mockResolvedValue(undefined),
    })),
    Worker: jest.fn().mockImplementation(() => ({
      close: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
    })),
  };
});

describe('Upload API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    // Ensure Fastify closes all open server connections completely
    if (app) {
      await app.close();
    }
  });

  it('Should return 406 if the request is not multipart (no file provided)', async () => {
    const response = await request(app.server)
      .post('/api/upload');

    expect(response.status).toBe(406);
    expect(response.body).toHaveProperty('message', 'the request is not multipart');
  });

  it('Should accept the file, process it via streams, and return 202 Accepted', async () => {
    const testFilePath = path.join(__dirname, 'test-dummy.txt');
    fs.writeFileSync(testFilePath, 'Dummy content for the stream test.');

    const response = await request(app.server)
      .post('/api/upload')
      .attach('file', testFilePath);

    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty('status', 'Accepted');
    
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });
});