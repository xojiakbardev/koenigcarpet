"use client"

import { useQueryState } from '@/hooks/useQueryState'
import React, { useState } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import useDrawerStore from '@/hooks/useDrawerStore'
import nProgress from "nprogress";

interface SortOption {
  value: string
  label: string
}

const toList = (v: any): string[] => {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

const ProductControl: React.FC = () => {
  // grid & sort
  const [grid, setGrid] = useQueryState('grid', false)
  const [sortBy, setSortBy, clearSortBy] = useQueryState('sortBy', false)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  // drawer
  const { open } = useDrawerStore()

  // filters (ko‘p qiymatlilar uchun 3-return clear funksiyasidan foydalandik)
  const [inStock, , clearInStock] = useQueryState("inStock", false)
  const [colors, , clearColors] = useQueryState("colors", true)
  const [styles, , clearStyles] = useQueryState("styles", true)
  const [collections, , clearCollections] = useQueryState("collections", true)
  const [sizes, , clearSizes] = useQueryState("sizes", true)

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
    if (value === 'default') {
      clearSortBy()
    } else {
      nProgress.start()
      setSortBy(value)
    }
    setIsDropdownOpen(false)
  }

  // badge’lar
  const badges: { label: string; onClear: () => void }[] = []
  if (inStock) {
    badges.push({ label: 'In Stock', onClear: () => clearInStock() })
  }
  const colorsList = toList(colors)
  if (colorsList.length) {
    badges.push({ label: `Colors: ${colorsList.join(', ')}`, onClear: () => clearColors() })
  }
  const stylesList = toList(styles)
  if (stylesList.length) {
    badges.push({ label: `Styles: ${stylesList.join(', ')}`, onClear: () => clearStyles() })
  }
  const collectionsList = toList(collections)
  if (collectionsList.length) {
    badges.push({ label: `Collections: ${collectionsList.join(', ')}`, onClear: () => clearCollections() })
  }
  const sizesList = toList(sizes)
  if (sizesList.length) {
    badges.push({ label: `Sizes: ${sizesList.join(', ')}`, onClear: () => clearSizes() })
  }

  return (
    <div className="flex flex-col gap-3 bg-white p-4 relative">
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
