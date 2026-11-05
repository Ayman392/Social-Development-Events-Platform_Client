import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set in .env.local");

declare global {
  var _mongoClient: MongoClient | undefined;
}

if (!globalThis._mongoClient) {
  globalThis._mongoClient = new MongoClient(uri);
}

export const client = globalThis._mongoClient;
export const db = client.db("eventsPlatform");
