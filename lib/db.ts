import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI!;   //! is used to tell TypeScript that the variable is defined and not null

if (!MONGODB_URI){
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose; // global.mongoose is used to store the mongoose connection, if it is already established then it will be used again and again without creating a new connection otherwise it will create a new connection


//this is used to check if the mongoose connection is already established or not

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }; //if the connection is not established then it will create a new connection by null the conn and promise
} //this is used to cache the mongoose connection either the connection is already established or not


export async function connectToDatabase() {
    if (cached.conn){
        return cached.conn;
    } //if the connection is already established then it will return the connection

    if (!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,

        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection)
    } //if the connection is not established then it will create a new connection

    //if the connection is established then it will return the connection

    try {
        cached.conn = await cached.promise; //promise is used to wait for the connection to be established
    } catch (error) {
        cached.promise = null;
        throw error;
    }


    return cached.conn;

}

