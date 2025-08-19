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

  const filterOptions = [
    'Všechny kategorie',
    ...Object.values(categories!).map((sub) => sub.label),
    'Odemčené',
    'Zamčené',
  ]

  function handleFilter(value: string) {
    const filter = value.toLowerCase()
    switch (filter) {
      case 'všechny kategorie':
        setFilteredSubcategories(sortedSubcategories)
        break
      case 'odemčené':
        setFilteredSubcategories(sortedSubcategories.filter((sub) => sub.isUnlocked))
        break
      case 'zamčené':
        setFilteredSubcategories(sortedSubcategories.filter((sub) => !sub.isUnlocked))
        break

      default:
        setFilteredSubcategories(sortedSubcategories.filter((sub) => sub.category.label.toLowerCase() === filter))
        break
    }
  }

  return (
    <>
      <Header />
      <Dropdown options={filterOptions} onChange={handleFilter} />
      <ul className='gap-8 grid auto-rows-fr grid-cols-1 sm:grid-cols-2 w-full max-w-sm sm:max-w-none'>
        {Object.values(filteredSubcategories).map((sub) => (
          <SubcategoryCard key={sub.id} subcategory={sub} />
        ))}
      </ul>
    </>
  )
}
