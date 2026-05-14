import { auth } from '@/lib/auth'
import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
 
 const AuthLayout = async ({children}) => {
  const authInstanse = auth()
  const session = await  authInstanse.api.getSession({
    headers: await headers()
  })

  // console.log("> ",session)
  if(session){
    return redirect("/");
  }
   return (
     <div>
       <>{children}</>
     </div>
   )
 }
 
 export default AuthLayout
 