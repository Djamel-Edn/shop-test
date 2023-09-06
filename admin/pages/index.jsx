
import Layout from "@/components/layout"
import { useSession, signIn, signOut } from "next-auth/react"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()
    return(
      <Layout>

       <div className="text-white flex justify-between">
        <h2 className="text">
          {session && session.user ? (
      
        <h2 className="text">Hello, {session.user.name}</h2>
        
     
    ) : (
      <p>Loading user data...</p>
    )}</h2>
        <div>
        <img src={session?.user?.image} alt="" srcset="" className=""/>
        </div>
       </div>
      </Layout>
    )
}
