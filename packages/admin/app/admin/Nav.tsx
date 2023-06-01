'use client'

import clsx from 'clsx'
import { useState } from 'react'

const navItems = [
   {
      name: 'Folders',
      svg: (
         <svg
            aria-hidden='true'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='h-6 w-6'
         >
            <path
               stroke-linecap='round'
               stroke-linejoin='round'
               stroke-width='2'
               d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
            />
         </svg>
      ),
   },
   {
      name: 'Dashboard',
      svg: (
         <svg
            aria-hidden='true'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='h-6 w-6'
         >
            <path
               stroke-linecap='round'
               stroke-linejoin='round'
               stroke-width='2'
               d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
         </svg>
      ),
   },
]

export function Nav() {
   const [activedItem, setActivedItem] = useState<number | undefined>()

   console.log('activedItem', activedItem)

   return (
      <nav className='flex flex-col mx-4 my-6 space-y-4'>
         {navItems.map((item, index) => (
            <a
               key={index}
               href='#'
               className={clsx(
                  'inline-flex items-center justify-center py-3 hover:bg-gray-700 rounded-lg',
                  {
                     'text-gray-400': activedItem !== index,
                     'text-blue-400 bg-gray-700': activedItem === index,
                  },
               )}
               onClick={() => setActivedItem(index)}
            >
               <span className='sr-only'>{item.name}</span>
               {item.svg}
            </a>
         ))}
      </nav>
   )
}
