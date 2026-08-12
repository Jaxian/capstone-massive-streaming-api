import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { MultipartFile } from '@fastify/multipart';

export const saveStreamToDisk = async (part: MultipartFile): Promise<string> => {
  const uploadDir = path.resolve(__dirname, '../../uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, `${Date.now()}-${part.filename}`);
  const writeStream = fs.createWriteStream(filePath);

  // Cast part.file to NodeJS.ReadableStream to satisfy strict NodeNext pipeline types
  await pipeline(part.file as unknown as NodeJS.ReadableStream, writeStream);

  return filePath;
};