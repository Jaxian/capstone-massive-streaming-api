import { FastifyRequest, FastifyReply } from 'fastify';
import { saveStreamToDisk } from '../services/streamService';
import { addProcessJob } from '../queues/processQueue';

export const handleUpload = async (req: FastifyRequest, reply: FastifyReply) => {
  const data = await req.file();
  
  if (!data) {
    return reply.code(400).send({ error: 'No file provided' });
  }

  try {
    // 1. Save the file to disk using streams
    const filePath = await saveStreamToDisk(data);

    // 2. Dispatch the heavy task to Redis/BullMQ (Offloading)
    await addProcessJob({ filePath, fileName: data.filename });

    // 3. Respond quickly to the client to free the Event Loop
    return reply.code(202).send({ 
      status: 'Accepted', 
      message: 'File is being processed in the background.' 
    });
  } catch (error) {
    req.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};