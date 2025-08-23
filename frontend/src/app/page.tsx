'use client'
import { useEffect, useState } from 'react'

import Header from '@/components/Header'
import SubcategoryCard from '@/components/subcategory/SubcategoryCard'
import { useCategoryStore } from '@/stores/category_store'
import Dropdown from '@/components/common/Dropdown'
import { type Subcategory } from '@/types/subcategory'

export default function Home() {
  const { subcategories, categories } = useCategoryStore()
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('Všechny kategorie')
  const [filterOptions, setFilterOptions] = useState<[string, string][]>([])

  useEffect(() => {
    if (!subcategories || !categories) {
      return
    }
    setFilteredSubcategories(
      [...Object.values(subcategories)].sort((a, b) => {
        if (a.isUnlocked && !b.isUnlocked) return -1
        if (!a.isUnlocked && b.isUnlocked) return 1
        return a.unlockPrice - b.unlockPrice
      })
    )
    setFilterOptions([
      ['all', 'Všechny kategorie'],
      ...(Object.entries(categories).map(([catId, cat]) => [catId, cat.label]) as [string, string][]),
      ['unlocked', 'Odemčené'],
      ['locked', 'Zamčené'],
    ])
  }, [categories, subcategories])

  function handleFilter(filter: string) {
    setSubcategoryFilter(filter)
    switch (filter) {
      case 'all':
        setFilteredSubcategories(filteredSubcategories)
        break
      case 'unlocked':
        setFilteredSubcategories(filteredSubcategories.filter((sub) => sub.isUnlocked))
        break
      case 'locked':
        setFilteredSubcategories(filteredSubcategories.filter((sub) => !sub.isUnlocked))
        break

      default:
        setFilteredSubcategories(filteredSubcategories.filter((sub) => sub.category.id === filter))
        break
    }
  }

  return (
    <main>
      <Header />
      <Dropdown options={filterOptions} value={subcategoryFilter} onChange={handleFilter} />
      <ul className='gap-8 grid auto-rows-fr grid-cols-1 my-4 sm:grid-cols-2 w-full max-w-sm sm:max-w-none'>
        {Object.values(filteredSubcategories).map((sub) => (
          <SubcategoryCard key={sub.id} subcategoryId={sub.id} />
        ))}
      </ul>
    </main>
  )
}
