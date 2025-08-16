"use client"

import React, { useState, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { useQueryState } from '@/hooks/useQueryState'
import useDrawerStore from '@/hooks/useDrawerStore'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterSection {
  key: string
  title: string
  options: FilterOption[]
}

const filterSections: FilterSection[] = [
  {
    key: 'color',
    title: 'COLOR',
    options: [
      { value: 'beyaz', label: 'BEYAZ', count: 24 },
      { value: 'cok-renkli', label: 'ÇOK RENKLİ', count: 18 },
      { value: 'beige', label: 'BEIGE', count: 32 },
      { value: 'black', label: 'BLACK', count: 15 },
      { value: 'blue', label: 'BLUE', count: 21 },
      { value: 'brown', label: 'BROWN', count: 19 },
      { value: 'grey', label: 'GREY', count: 28 },
      { value: 'red', label: 'RED', count: 12 }
    ]
  },
  {
    key: 'style',
    title: 'STYLE',
    options: [
      { value: 'abstract', label: 'ABSTRACT', count: 45 },
      { value: 'amorphous', label: 'AMORPHOUS', count: 23 },
      { value: 'art', label: 'ART', count: 31 },
      { value: 'classic', label: 'CLASSIC', count: 52 },
      { value: 'ethnic', label: 'ETHNIC', count: 18 },
      { value: 'geometric', label: 'GEOMETRIC', count: 36 },
      { value: 'modern', label: 'MODERN', count: 41 }
    ]
  },
  {
    key: 'collection',
    title: 'COLLECTION',
    options: [
      { value: 'amorph', label: 'AMORPH', count: 28 },
      { value: 'coral', label: 'CORAL', count: 19 },
      { value: 'ethnique', label: 'ETHNIQUE', count: 15 },
      { value: 'marquise', label: 'MARQUISE', count: 33 },
      { value: 'monochrome', label: 'MONOCHROME', count: 24 },
      { value: 'vintage', label: 'VINTAGE', count: 41 }
    ]
  }
]

const FilterDrawer: React.FC = () => {
  const { filterbar, close } = useDrawerStore()
  const [inStock, setInStock, clearInStock] = useQueryState('inStock', false)
  const [colors, setColors, clearColors] = useQueryState('colors', false)
  const [styles, setStyles, clearStyles] = useQueryState('styles', false)
  const [collections, setCollections, clearCollections] = useQueryState('collections', false)
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    if (filterbar) setIsVisible(true)
    else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [filterbar])

  const selectedValues = {
    color: colors ? colors.split(',') : [],
    style: styles ? styles.split(',') : [],
    collection: collections ? collections.split(',') : []
  }

  const updateQuery = (key: string, value: string, checked: boolean) => {
    const current = selectedValues[key as keyof typeof selectedValues]
    const updated = checked ? [...current, value] : current.filter(v => v !== value)
    const setter = key === 'color' ? setColors : key === 'style' ? setStyles : setCollections
    setter(updated.join(','))
  }

  const toggleSection = (key: string) => {
    setExpandedSection(prev => (prev === key ? null : key))
  }

  if (!isVisible) return null

  return (
    <div className={`flex flex-col fixed top-0 shadow-xl z-50 w-full h-full md:max-w-md bg-white transition-all duration-300 ${filterbar ? 'right-0' : '-right-96'}`}>
      <div className="flex items-center justify-between h-14 px-5 bg-black text-white">
        <h2 className="text-base font-medium tracking-wider uppercase">Filter By</h2>
        <button onClick={() => close('filterbar')} className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/10 transition">
          <X className="w-4 h-4"/>
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
            <span className="text-base font-medium text-gray-900">In Stock</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={inStock === 'true'} onChange={e => setInStock(e.target.checked ? 'true' : 'false')} />
              <div className="w-12 h-7 bg-gray-200 peer-checked:bg-black rounded-full relative after:absolute after:top-[2px] after:left-[2px] after:w-6 after:h-6 after:bg-white after:rounded-full after:border after:border-gray-300 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>

          {filterSections.map(section => {
            const isExpanded = expandedSection === section.key
            const selectedCount = selectedValues[section.key as keyof typeof selectedValues].length

            return (
              <div key={section.key} className="border-b border-gray-100 last:border-b-0">
                <button onClick={() => toggleSection(section.key)} className="w-full px-5 py-5 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <span className="text-base font-medium text-gray-900 tracking-wide">{section.title}</span>
                    {selectedCount > 0 && <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium min-w-[1.5rem] text-center">{selectedCount}</span>}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 pb-4 space-y-3">
                    {section.options.map((opt) => (
                      <label key={opt.value} className="flex items-center justify-between cursor-pointer group py-1">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="w-5 h-5 border-2 border-gray-300 rounded checked:bg-black checked:border-black transition" checked={selectedValues[section.key as keyof typeof selectedValues].includes(opt.value)} onChange={e => updateQuery(section.key, opt.value, e.target.checked)} />
                          <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{opt.label}</span>
                        </div>
                        {opt.count && <span className="text-xs text-gray-400 font-medium">({opt.count})</span>}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-auto border-t border-gray-100 bg-white">
          <button  onClick={() => {
            clearCollections()
            clearStyles()
            clearColors()
            clearInStock()
          }} className="w-full p-5 cursor-pointer text-sm font-medium text-red-500 hover:text-red-600 transition">CLEAR ALL FILTERS</button>
        </div>
      </div>
    </div>
  )
}

export default FilterDrawer
