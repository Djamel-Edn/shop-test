import Nav from "@/components/nav"
import { useSession, signIn, signOut} from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export default function Layout({children}){
  const [showNav,setShowNav]=useState(false)
    const { data: session } = useSession()  
    if (!session){
        return (
          <div className=' h-screen w-screen flex items-center bg-gray-600'>
            <div className='text-center w-full'>
              <button onClick={() => signIn('google')} className='bg-white p-2 px-4 rounded-lg text-xl'>Login with Google </button>
          
            </div>
          </div>
        )}
        return(
        <div className=" min-h-screen flex flex-col">
            <header className="h-1/4 p-2 text-white bg-blue-900 flex justify-between">
            <button className="absolute top-4 md:hidden" onClick={()=>setShowNav(!showNav)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button> 

            <Link href={'/'} className="flex gap-2 m-2 ml-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg> 
             <h1>Ecommerce-shop</h1>
        </Link>
        <div className="flex  items-center">
               <h3 className="m-2 mr-6">
                Logged in {session.user.name}
                </h3> 

                <button className="flex gap-1" onClick={async ()=>signOut()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                  Logout
                </button>
        </div>
            </header>
            <div className="flex">
          <Nav show={showNav}/>     
          
         <div className="min-h-screen bg-purple-700 flex-grow px-3 py-4 "> {children}</div>
          </div>
            </div>
      )
}