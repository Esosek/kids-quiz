import { useState } from 'react'

import Header from './Header'
import SubcategoryCard from './subcategory/SubcategoryCard'
import { useCategoryStore } from '@/stores/category_store'
import Dropdown from './common/Dropdown'

export default function Dashboard() {
  const { subcategories, categories } = useCategoryStore()
  const sortedSubcategories = [...Object.values(subcategories!)].sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1
    if (!a.isUnlocked && b.isUnlocked) return 1
    return a.unlockPrice - b.unlockPrice
  })
  const [filteredSubcategories, setFilteredSubcategories] = useState(sortedSubcategories)

  const filterOptions: [string, string][] = [
    ['all', 'Všechny kategorie'],
    ...(Object.entries(categories!).map(([catId, cat]) => [catId, cat.label]) as [string, string][]),
    ['unlocked', 'Odemčené'],
    ['locked', 'Zamčené'],
  ]

  function handleFilter(filter: string) {
    switch (filter) {
      case 'all':
        setFilteredSubcategories(sortedSubcategories)
        break
      case 'unlocked':
        setFilteredSubcategories(sortedSubcategories.filter((sub) => sub.isUnlocked))
        break
      case 'locked':
        setFilteredSubcategories(sortedSubcategories.filter((sub) => !sub.isUnlocked))
        break

      default:
        setFilteredSubcategories(sortedSubcategories.filter((sub) => sub.category.id === filter))
        break
    }
  }

  return (
    <main>
      <Header />
      <Dropdown options={filterOptions} onChange={handleFilter} />
      <ul className='gap-8 grid auto-rows-fr grid-cols-1 sm:grid-cols-2 w-full max-w-sm sm:max-w-none'>
        {Object.values(filteredSubcategories).map((sub) => (
          <SubcategoryCard key={sub.id} subcategoryId={sub.id} />
        ))}
      </ul>
    </main>
  )
}
