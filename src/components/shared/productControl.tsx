"use client"

import React, { FC, useState } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import useDrawerStore from '@/hooks/useDrawerStore'
import nProgress from "nprogress";
import { useRouter } from 'next/navigation'

interface SortOption {
  value: string
  label: string
}

const toList = (v: any): string[] => {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

interface Props {
  searchParams: Record<string, string>
}


const ProductControl: FC<Props> = ({ searchParams }) => {
  const router = useRouter()

  const grid = searchParams.grid
  const sortBy = searchParams.sortBy
  const colors = searchParams.colors
  const styles = searchParams.styles
  const collections = searchParams.collections
  const sizes = searchParams.sizes
  const inStock = searchParams.inStock

  const setGrid = (value: string) => {
    nProgress.start()
    const params = new URLSearchParams(window.location.search)
    params.set('grid', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const setParams = (key: string, value: string) => {
    nProgress.start()
    const params = new URLSearchParams(window.location.search)
    params.set(key, value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearParams = (key: string) => {
    nProgress.start()
    const params = new URLSearchParams(window.location.search)
    params.delete(key)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  const { open } = useDrawerStore()

  // sort tanlovlari ("" EMAS!)
  const sortOptions: SortOption[] = [
    { value: 'default', label: 'SORT BY' },
    { value: 'name_asc', label: 'PRODUCT NAME (A TO Z)' },
    { value: 'name_desc', label: 'PRODUCT NAME (Z TO A)' },
    { value: 'price_asc', label: 'PRICE (LOW TO HIGH)' },
    { value: 'price_desc', label: 'PRICE (HIGH TO LOW)' },
    { value: 'stock_code', label: 'STOCK CODE' },
    { value: 'newest', label: 'YENİDEN ESKİYE' },
    { value: 'oldest', label: 'ESKİDEN YENİYE' }
  ]
  const currentSort: SortOption =
    sortOptions.find(o => o.value === sortBy) || sortOptions[0]

  // dropdown outside-click (desktop/mobil alohida)

  const handleSortSelect = (value: string) => {
    nProgress.start()
    if (value === 'default') {
      clearParams('sortBy')
    } else {
      setParams('sortBy', value)
    }
    setIsDropdownOpen(false)
  }

  // badge’lar
  const badges: { label: string; onClear: () => void }[] = []
  if (inStock) {
    badges.push({ label: 'In Stock', onClear: () => clearParams('inStock') })
  }
  const colorsList = toList(colors)
  if (colorsList.length) {
    badges.push({ label: `Colors: ${colorsList.join(', ')}`, onClear: () => clearParams('colors') })
  }
  const stylesList = toList(styles)
  if (stylesList.length) {
    badges.push({ label: `Styles: ${stylesList.join(', ')}`, onClear: () => clearParams('styles') })
  }
  const collectionsList = toList(collections)
  if (collectionsList.length) {
    badges.push({ label: `Collections: ${collectionsList.join(', ')}`, onClear: () => clearParams('collections') })
  }
  const sizesList = toList(sizes)
  if (sizesList.length) {
    badges.push({ label: `Sizes: ${sizesList.join(', ')}`, onClear: () => clearParams('sizes') })
  }

  return (
    <div className="flex flex-col gap-3 bg-white py-4 px-4 md:px-10 relative">
      {/* Active filter badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {badges.map((b, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-xs py-1 px-2 border border-black transition hover:bg-gray-100"
            >
              <span className="font-medium">{b.label}</span>
              <button
                aria-label="Clear filter"
                className="p-0.5 hover:text-red-500 transition cursor-pointer"
                onClick={b.onClear}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* CONTROL BAR */}
      <div className="flex gap-4 justify-end items-center">

        {/* SORT (desktop) */}
        <div className="relative hidden md:block" >
          <button
            className="cursor-pointer uppercase flex items-center gap-2 hover:text-gray-600 transition-colors"
            onClick={() => setIsDropdownOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen}
          >
            {currentSort.label}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div
              role="menu"
              className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  role="menuitem"
                  className={`w-full cursor-pointer p-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group ${currentSort.value === option.value ? 'bg-gray-100' : ''}`}
                  onClick={() => handleSortSelect(option.value)}
                >
                  <span className={`text-xs font-medium whitespace-nowrap ${currentSort.value === option.value ? 'text-black' : 'text-gray-700'} group-hover:text-black transition-colors`}>
                    {option.label}
                  </span>
                  {currentSort.value === option.value && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GRID (faqat md↑) */}
        <div className="hidden md:flex gap-2">
          {['3', '4', '6'].map(num => (
            <button
              key={num}
              data-active={grid === num}
              className="cursor-pointer border-b-2 border-b-transparent data-[active=true]:border-b-black transition-all hover:text-gray-600"
              onClick={() => { nProgress.start(); setGrid(num) }}
            >
              {num}
            </button>
          ))}
        </div>

        {/* FILTER (desktop) */}
        <button
          className="hidden md:block cursor-pointer uppercase hover:text-gray-600 transition-colors"
          onClick={() => open('filterbar')}
        >
          Filter by
        </button>

        {/* MOBILE (faqat <md) — 2 ta tugma 50%/50% */}
        <div className="flex w-full gap-2 md:hidden">
          {/* SORT (mobile) */}
          <div className="relative flex-1">
            <button
              className="w-full border border-black px-3 py-2 text-xs uppercase text-center hover:bg-black hover:text-white transition-colors"
              onClick={() => setIsDropdownOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
            >
              Sort
            </button>

            {isDropdownOpen && (
              <div
                role="menu"
                className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-lg z-50"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    role="menuitem"
                    className={`w-full p-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group ${currentSort.value === option.value ? 'bg-gray-100' : ''}`}
                    onClick={() => handleSortSelect(option.value)}
                  >
                    <span className={`text-xs font-medium whitespace-nowrap ${currentSort.value === option.value ? 'text-black' : 'text-gray-700'} group-hover:text-black transition-colors`}>
                      {option.label}
                    </span>
                    {currentSort.value === option.value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FILTER (mobile) */}
          <button
            className="flex-1 border border-black px-3 py-2 text-xs uppercase text-center hover:bg-black hover:text-white transition-colors"
            onClick={() => open('filterbar')}
          >
            Filter
          </button>
        </div>
      </div>

      {/* BACKDROP — har ikkala rejim uchun */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default ProductControl
