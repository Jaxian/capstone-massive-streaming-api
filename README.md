# Capstone Massive Streaming API 🚀

A high-performance, enterprise-grade Node.js backend application built with **Fastify**, **TypeScript**, **BullMQ**, **Redis**, and **Scalar**. This project serves as a Capstone implementation demonstrating Senior-level backend architecture, memory protection via native streams, and asynchronous background task offloading.

---

## Project Objectives

The primary objectives of this project are:

1. **Memory Protection via Native Streams**: Prevent server RAM exhaustion when handling massive file uploads (e.g., gigabyte-scale CSVs or reports) by utilizing Node.js Streams (`pipeline`) to stream data chunk-by-chunk directly to disk.
2. **Event Loop Non-Blocking Architecture**: Ensure the main HTTP thread remains completely free and responsive by offloading heavy computational workloads to independent background workers using **BullMQ** and **Redis**.
3. **High-Performance Routing & Validation**: Leverage **Fastify** (powered by Radix trees and JIT-compiled JSON schema validation via Ajv) for lightning-fast request handling.
4. **Clean Architecture Standards**: Maintain strict separation of concerns by decoupling routing, request validation, business logic controllers, stream services, and background queue workers.
5. **Modern API Documentation**: Provide clean, interactive, and automated API reference documentation out-of-the-box using **Scalar** and **OpenAPI/Swagger**.
6. **Robust Testing**: Ensure system reliability and prevent regressions through comprehensive integration and unit tests using **Jest** and **Supertest**.

---

## System Architecture

```mermaid
graph TD
    Client[Client / Frontend] -->|HTTP POST /api/upload (multipart/form-data)| Fastify[Fastify Server]
    
    subgraph Fastify Application [Fastify Core & Documentation]
        Fastify -->|OpenAPI / Swagger| Scalar[Scalar API Reference UI at /reference]
        Fastify -->|Route & Schema Validation| Controller[Upload Controller]
    end

    Controller -->|Native Streams Pipeline| StreamService[Stream Service]
    StreamService -->|Streams file chunks safely| Disk[(Local Disk / Uploads Directory)]

    Controller -->|Dispatches Job (Offloading)| Queue[BullMQ Producer / fileQueue]
    Controller -->|HTTP 202 Accepted response| Client

    Queue -->|Persists Job Data| Redis[(Redis In-Memory Database)]
    
    subgraph Background Processing [Asynchronous Worker]
        Redis -->|Pulls Job via Consumer| Worker[BullMQ Worker / Process Worker]
        Worker -->|Processes heavy payload asynchronously| BackgroundTask[Massive Data Parsing / CPU Task]
    end

---

## Project Structure

src/
├── config/
│   └── redis.config.ts       # Strict Redis configuration for BullMQ
├── queues/
│   ├── processQueue.ts       # BullMQ Job Producer
│   └── processWorker.ts      # Asynchronous Background Worker
├── controllers/
│   └── uploadController.ts   # Fastify HTTP request lifecycle orchestrator
├── services/
│   └── streamService.ts      # Native Stream pipeline handler for memory safety
├── routes/
│   └── uploadRoutes.ts       # Endpoint definitions and OpenAPI schemas
└── server.ts                 # Fastify instance bootstrap & plugin registration
tests/
    └── upload.test.ts        # Supertest integration tests with mocked BullMQ

## Getting Started

Prerequisites
Node.js (v18+ recommended)

Docker (for running a local Redis instance)

- Installation & Setup
Clone the repository:

git clone [https://github.com/Jaxian/capstone-massive-streaming-api.git](https://github.com/Jaxian/capstone-massive-streaming-api.git)
cd capstone-massive-streaming-api

- Install dependencies:
npm install

- Start Redis (via Docker):
docker run -d --name redis-capstone -p 6379:6379 redis:alpine

- Run the application in development mode:
npm run dev

- Start the background worker (in a separate terminal):
npm run worker

## API Documentation
Once the server is running, you can access the interactive Scalar API documentation interface at:
http://localhost:3000/reference

## Running Tests
Execute the automated test suite using Jest:
npm test

## Tech Stack
Runtime: Node.js

Language: TypeScript (Strict Mode)

Web Framework: Fastify

File Upload Handling: @fastify/multipart

Queue & Background Processing: BullMQ & ioredis

API Documentation: @fastify/swagger & @scalar/fastify-api-reference

Testing: Jest & Supertest

