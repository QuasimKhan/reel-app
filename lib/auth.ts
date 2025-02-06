import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please Enter Email and Password")
                }


                try {
                    await connectToDatabase();

                    const user = await User.findOne({ email: credentials.email })

                    if (!user) {
                        throw new Error("No User Found")
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password)

                    if (!isValid) {
                        throw new Error("Invalid Password")
                    }


                    return {
                        id: user._id.toString(),
                        email: user.email
                    }




                } catch (error) {
                    throw error
                }
            }

        })
    ],
    callbacks: {
        /**
          The `jwt` callback is called after the user has been authenticated and is used to generate a JSON Web Token (JWT) that will be sent to the client.
          It receives the `token` and `user` objects as arguments. The `token` object is the one that will be sent to the client, and the `user` object is the user object that was returned from the `authorize` callback.
         
          In this case, we add the `id` property to the `token` object from the `user` object, so that it is available on the client.
         * param {object} token - The token that will be sent to the client.
         * param {object} user - The user object that was returned from the
         *   `authorize` callback.
         * return {Promise<object>} The token that will be sent to the client.
         */
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }

            return token
        },



/** The `session` callback is called whenever a session is checked or created. 
 * It is used to customize the session object that will be sent to the client.
 * This function receives the `session` and `token` objects as arguments.
 * The `session` object is the session object that will be sent to the client, and the `token` object is the token that was returned from the `jwt` callback.
 * 
 * In this case, we add the `id` property to the `session.user` object from the `token` object, so that it is available on the client.
 *
 * param {object} session - The session object that will be sent to the client.
 * param {object} token - The token object that was returned from the `jwt` callback.
 * return {Promise<object>} The session object that will be sent to the client.
 */

        async session({session, token}){

            if(session.user){
                session.user.id = token.id as string

            }


            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}