import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { useCurrencyStore } from '@/stores/currency_store'
import { useCategoryStore } from '@/stores/category_store'
import PrimaryButton from '../common/PrimaryButton'
import LoadSpinner from '../common/LoadSpinner'
import SubcategoryTracker from './SubcategoryTracker'
import CurrencyDisplay from '../CurrencyDisplay'

type SubcategoryCardProps = {
  subcategoryId: string
}

export default function SubcategoryCard({ subcategoryId }: SubcategoryCardProps) {
  const router = useRouter()
  const { currency, removeCurrency } = useCurrencyStore()
  const [isUnlocking, setIsUnlocking] = useState(false)
  const { unlockSubcategory, subcategories } = useCategoryStore()

  const answeredQuestion = subcategories![subcategoryId].questions.filter((q) => q.hasUserAnswered)

  async function handleUnlock() {
    try {
      setIsUnlocking(true)
      await unlockSubcategory(subcategoryId)
      await removeCurrency(subcategories![subcategoryId].unlockPrice)
    } catch (error) {
      console.log(error)
    }
    setIsUnlocking(false)
  }

  function handleStartQuiz() {
    router.push(`/quiz?id=${subcategoryId}`)
  }
  return (
    <li className='relative text-center w-full bg-pink-300 pt-6 pb-10 px-8 rounded-2x flex flex-col gap-5 justify-between items-center shadow-xl rounded-2xl'>
      <h2 className='uppercase text-2xl font-light'>{subcategories![subcategoryId].label}</h2>
      <div className='relative h-20 w-full flex justify-center'>
        <Image
          src={subcategories![subcategoryId].imageURL}
          alt={`Obrázek kvízu s názvem "${subcategories![subcategoryId].label}"`}
          fill
          sizes='100%'
          className='object-contain'
        />
      </div>

      <SubcategoryTracker
        answeredCount={answeredQuestion.length}
        questionCount={subcategories![subcategoryId].questions.length}
      />

      {subcategories![subcategoryId].isUnlocked ? (
        <PrimaryButton fontSize='text-base' onClick={handleStartQuiz}>
          SPUSTIT
        </PrimaryButton>
      ) : (
        <>
          <PrimaryButton
            fontSize='text-base'
            bgColor='bg-amber-200'
            disabled={subcategories![subcategoryId].unlockPrice > currency || isUnlocking}
            paddingY='py-[0.625rem]'
            className='flex justify-center'
            onClick={handleUnlock}
          >
            {isUnlocking ? (
              <LoadSpinner />
            ) : (
              <CurrencyDisplay value={-subcategories![subcategoryId].unlockPrice} size='small' />
            )}
          </PrimaryButton>
        </>
      )}
      <Link href={'/subcategories/' + subcategoryId} className='mb-2 underline hover:opacity-75'>
        PROZKOUMAT
      </Link>
      <div className='absolute right-4 bottom-3 uppercase text-xs text-gray-800/60'>
        {subcategories![subcategoryId].category.label}
      </div>
    </li>
  )
}
