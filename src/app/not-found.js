import React from 'react'
import Image from 'next/image'


const NotFound = () => {
    
  return (
    <div className='h-screen flex flex-col justify-center items-center bg-white gap-5'>
      <Image src="/404.svg" alt="404 img" width={200} height={200}/>
      <h2 className='text-3xl font-semibold text-black flex  justify-center items-center gap-2'>Page Not Found <Image src="/warn.gif" alt="404 img" width={45} height={45}/></h2>
    </div>
  )
}

export default NotFound
