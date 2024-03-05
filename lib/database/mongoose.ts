import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}
//we will implement caching because despite the basic express and mongoDb applications, nextJS is serverless framework so, we need to connect everytime to the database to fetch data, so we are caching the data to improve the reliability and making it robust
let cached: MongooseConnection = (global as any).mongoose

if (!cached) { //calling it for the first time
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: 'imaginify', bufferCommands: false
        })

    cached.conn = await cached.promise;

    return cached.conn;
}