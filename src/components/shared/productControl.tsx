"use client"

import { useQueryState } from '@/hooks/useQueryState'
import React, { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import useOutsideClick from '@/hooks/useOutsideClick'
import useDrawerStore from '@/hooks/useDrawerStore'

interface SortOption {
  value: string
  label: string
}


const ProductControl: React.FC = () => {
  const [grid, setGrid] = useQueryState('grid', false)
  const [sortBy, setSortBy] = useQueryState('sortBy', false)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const {open} = useDrawerStore()

  const sortOptions: SortOption[] = [
    { value: '', label: 'SORT BY' },
    { value: 'name_asc', label: 'PRODUCT NAME (A TO Z)' },
    { value: 'name_desc', label: 'PRODUCT NAME (Z TO A)' },
    { value: 'price_asc', label: 'PRICE (LOW TO HIGH)' },
    { value: 'price_desc', label: 'PRICE (HIGH TO LOW)' },
    { value: 'stock_code', label: 'STOCK CODE' },
    { value: 'newest', label: 'YENİDEN ESKİYE' },
    { value: 'oldest', label: 'ESKİDEN YENİYE' }
  ]

  const currentSort: SortOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0]

 const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false))

  const handleSortSelect = (value: string) => {
    setSortBy(value)
    setIsDropdownOpen(false)
  }

  return (
    <div className='flex gap-4 justify-end items-center bg-white p-4'>
      <div className='relative' ref={dropdownRef}>
        <button 
          className='cursor-pointer uppercase flex items-center gap-2 hover:text-gray-600 transition-colors'
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {currentSort.label}
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className='absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden'>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full p-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group ${
                    currentSort.value === option.value ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSortSelect(option.value)}
                >
                  <span className={`text-xs font-medium whitespace-nowrap cursor-pointer ${
                    currentSort.value === option.value ? 'text-black' : 'text-gray-700'
                  } group-hover:text-black transition-colors`}>
                    {option.label}
                  </span>
                  {currentSort.value === option.value && (
                    <Check className='w-4 h-4 text-black' />
                  )}
                </button>
              ))}
          </div>
        )}

        {isDropdownOpen && (
          <div 
            className='fixed inset-0 z-40'
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>

      <div className='flex w-[1px] h-5 bg-black'></div>

      <div className='flex gap-2'>
        <button
          data-active={grid === '3'}
          className='cursor-pointer border-b-2 border-b-transparent data-[active=true]:border-b-black transition-all hover:text-gray-600'
          onClick={() => setGrid('3')}
        >
          3
        </button>
        <button
          data-active={grid === '4'}
          className='cursor-pointer border-b-2 border-b-transparent data-[active=true]:border-b-black transition-all hover:text-gray-600'
          onClick={() => setGrid('4')}
        >
          4
        </button>
        <button
          data-active={grid === '6'}
          className='cursor-pointer border-b-2 border-b-transparent data-[active=true]:border-b-black transition-all hover:text-gray-600'
          onClick={() => setGrid('6')}
        >
          6
        </button>
      </div>

      <div className='flex w-[1px] h-5 bg-black'></div>

      <button className='cursor-pointer uppercase hover:text-gray-600 transition-colors'
        onClick={() => open('filterbar')}>
        Filter by
      </button>
    </div>
  )
}

export default ProductControl
