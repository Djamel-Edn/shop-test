import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from "@/lib/mongodb";


const adminEmails=['eroslmast3r@gmail.com','d.dib@esi-sba.dz']

export const authOpt= {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
   
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  adapter:MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session,token,user}) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
}

export default NextAuth(authOpt)

export async function isAdminRequest(req,res){
const session=await getServerSession(req,res,authOpt)
if (!adminEmails.includes(session?.user?.email)){
  throw 'not admin'
}

}