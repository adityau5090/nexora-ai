"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'

const SignIn = () => {
  return (
    <section className='flex flex-col gap-3 items-center justify-center min-h-screen bg-background px-4 py-16 md:py-32'>
        <div className='flex flex-row justify-center items-center gap-x-2'>
            <h1 className='text-3xl font-extrabold text-foreground'>Welcome to </h1>
            <Image src={'/logo2.svg'} alt="logo" width={150} height={150} className='pt-1' />  
        </div>

        <p className='my-2 text-md text-muted-foreground font-semibold'>
          Sign in below (we will increase your message limits if you do 😄)
        </p>

        <Button 
        variant={'default'}
        className={"max-w-sm w-full px-7 flex flex-row justify-center items-center cursor-pointer"}
        onClick={() => signIn.social({
          provider: "github",
          callbackURL:"/"
        })} >
          <Image src={"/github.svg"} alt='github logo' width={20} height={20}></Image>
          <span className='font-bold ml-2'>Sign in with Github</span>
        </Button>
        
    </section>
  )
}

export default SignIn
