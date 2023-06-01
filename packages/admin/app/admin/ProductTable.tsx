const productData = [
   {
      name: 'Apple MacBook Pro 17',
      color: 'Silver',
      category: 'Laptop',
      price: '$2999',
      bgColor: 'bg-white dark:bg-gray-900',
   },
   {
      name: 'Microsoft Surface Pro',
      color: 'White',
      category: 'Laptop PC',
      price: '$1999',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
   },
   {
      name: 'Magic Mouse 2',
      color: 'Black',
      category: 'Accessories',
      price: '$99',
      bgColor: 'bg-white dark:bg-gray-900',
   },
   {
      name: 'Google Pixel Phone',
      color: 'Gray',
      category: 'Phone',
      price: '$799',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
   },
   {
      name: 'Apple Watch 5',
      color: 'Red',
      category: 'Wearables',
      price: '$999',
      bgColor: 'bg-white dark:bg-gray-900',
   },
]

export function ProductTable() {
   return (
      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
         <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
               <th scope='col' className='px-6 py-3'>
                  应用名称
               </th>
               <th scope='col' className='px-6 py-3'>
                  操作
               </th>
            </tr>
         </thead>
         <tbody>
            {productData.map((product, index) => (
               <tr
                  key={index}
                  className={`${product.bgColor} border-b dark:border-gray-700`}
               >
                  <th
                     scope='row'
                     className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                     {product.name}
                  </th>
                  <td className='px-6 py-4'>
                     <a
                        href='#'
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                     >
                        预览
                     </a>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   )
}
