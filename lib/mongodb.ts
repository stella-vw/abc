import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI as string;
let client = new MongoClient(uri);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the connection isn't reset on every save
  let globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;