import { randomUUID } from "crypto"
import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "../../../../../adapter"

const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: "authentication",
        collections: {
            Accounts: "accounts",
            Sessions: "sessions",
            Users: "users",
            VerificationTokens: "tokens"
        }
    }) as any,
    providers: [
        CredentialsProvider({
            name: "InsaneDemonList sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "email..."
                },
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "username..."
                },
                password: {
                    label: "Password",
                    type: "text",
                    placeholder: "password..."
                }
            },
            authorize(credentials, req) {
                return {
                    ...credentials,
                    type: "credentials",
                    id: randomUUID()
                }
            },
        })
    ]
})

export { handler as GET, handler as POST }