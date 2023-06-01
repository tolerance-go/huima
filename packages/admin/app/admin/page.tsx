import { ProductTable } from './ProductTable'

export default function Home() {
   return (
      <div>
         <h2 className='text-lg mb-4 font-medium'>应用发布</h2>
         <div className='bg-white rounded-lg p-4'>
            <ProductTable />
         </div>
      </div>
   )
}
