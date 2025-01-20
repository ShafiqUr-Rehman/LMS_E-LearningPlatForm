// redis.js
import { createClient } from 'redis';

const redisClient = createClient({  // redisClient -> it should be redis
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect().then(() => {
  console.log('Redis connected successfully');
});

export default redisClient;  // jis naam se export kr rhy hain isi name se import krna hai
