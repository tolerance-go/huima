import { Aside } from './Aside'
import { Header } from './Header'

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <div className='flex w-full bg-gray-100 min-h-screen'>
         <div className='flex w-full bg-gray-100 min-h-screen'>
            <Aside />
            <div className='flex-grow text-gray-800'>
               <Header />
               <main className='p-6 sm:p-10 space-y-6'>{children}</main>
            </div>
         </div>
      </div>
   )
}
