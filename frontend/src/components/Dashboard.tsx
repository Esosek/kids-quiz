import Header from './Header'
import SubcategoryCard from './subcategory/SubcategoryCard'
import { useCategoryStore } from '@/stores/category_store'

export default function Dashboard() {
  const subcategories = useCategoryStore((state) => state.subcategories!)
  const sortedSubcategories = [...Object.values(subcategories)].sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1
    if (!a.isUnlocked && b.isUnlocked) return 1
    return a.unlockPrice - b.unlockPrice
  })
  return (
    <>
      <Header />
      <ul className='gap-8 grid auto-rows-fr grid-cols-1 sm:grid-cols-2 w-full max-w-sm sm:max-w-none'>
        {Object.values(sortedSubcategories).map((sub) => (
          <SubcategoryCard key={sub.id} subcategory={sub} />
        ))}
      </ul>
    </>
  )
}
