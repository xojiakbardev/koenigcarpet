import { FC, ReactNode } from 'react'

type Props = {
    children: ReactNode
    grid: string
}

const ProductWrapper:FC<Props> = ({children, grid}) => {

  return (
    <div data-grid={["3", "4", "6"].includes(grid) ? grid : "3"} className='bg-white grid gap-4 p-10
    data-[grid=3]:grid-cols-3 data-[grid=4]:grid-cols-4 data-[grid=6]:grid-cols-6'>
        
      {children}
    </div>
  )
}

export default ProductWrapper
