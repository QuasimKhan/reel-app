import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}


/* 
This is not a class definition, but an interface definition. Here's a succinct explanation:

This interface defines a custom Session object that extends the DefaultSession object from next-auth.
The Session object has a user property that includes an id field of type string, in addition to any properties already defined in DefaultSession["user"].
In other words, this interface adds a custom id field to the user object in the Session object, while still inheriting any other properties from DefaultSession["user"].
 */