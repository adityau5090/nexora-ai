import { ModeToggle } from '@/components/ui/mode-toggle'
import { currentUser } from '@/modules/authentication_module/actions'
import UserButton from '@/modules/authentication_module/components/user-button'
import { Sun } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Header = async () => {
  const user = await currentUser()
  return (
    <div className='flex h-14 w-full flex-row gap-5 border-b border-border bg-sidebar  px-4 py-2'>
      <div className='flex gap-15 w-1/2 justify-end items-center'>
          <Link className='cursor-pointer hover:text-pink-700 border-2 px-4 py-1 rounded-lg border-zinc-600 hover:border-zinc-400' href={"/"}>Home</Link>
          <Link className='cursor-pointer hover:text-pink-700 border-2 px-4 py-1 rounded-lg border-zinc-600 hover:border-zinc-400' href={"/generate-image"}>Generate Image</Link>
          <Link className='cursor-pointer hover:text-pink-700 border-2 px-4 py-1 rounded-lg border-zinc-600 hover:border-zinc-400' href={"/resume-analyzer"}>Resume Analyze</Link>
                    {/* <li className='cursor-pointer hover:text-green-400'>About</li>
                    <li className='cursor-pointer hover:text-green-400'>Contact</li> */}
                
      </div>
      <div className='flex items-center gap-3 justify-end w-1/2'>
        <ModeToggle />
      <UserButton user={user} />
      </div>
    </div>
  )
}

export default Header
