export const Header = () => {
   return (
      <header className='flex items-center h-20 px-6 sm:px-10 bg-white'>
         <div className='flex flex-shrink-0 items-center ml-auto'>
            <div className='pl-3 ml-3 space-x-4'>
               <button className='relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full'>
                  <span className='sr-only'>Settings</span>
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
                        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                     />
                     <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                     />
                  </svg>
               </button>
               <button className='relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full'>
                  <span className='sr-only'>Log out</span>
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
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                     />
                  </svg>
               </button>
            </div>
         </div>
      </header>
   )
}
