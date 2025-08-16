"use client"

import { useQueryState } from '@/hooks/useQueryState'
import { FC, ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const ProductWrapper:FC<Props> = ({children}) => {
  const [grid] = useQueryState('grid', false)
  let gridCols = "3"

  if (["3", "4", "6"].includes(grid||"3")) {
    gridCols = grid
  }

  return (
    <div data-grid={gridCols} className='bg-white grid gap-4 p-10
    data-[grid=3]:grid-cols-3 data-[grid=4]:grid-cols-4 data-[grid=6]:grid-cols-6'>
        
      {children}
    </div>
  )
}

export default ProductWrapper
