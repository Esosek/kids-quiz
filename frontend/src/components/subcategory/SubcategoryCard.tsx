import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { type Subcategory } from '@/types/subcategory'
import SubcategoryTracker from './SubcategoryTracker'
import CurrencyDisplay from '../CurrencyDisplay'
import PrimaryButton from '../common/PrimaryButton'
import { useCurrencyStore } from '@/stores/currency_store'
import { useState } from 'react'
import LoadSpinner from '../common/LoadSpinner'
// import LinkButton from '../common/LinkButton'

type SubcategoryCardProps = {
  subcategory: Subcategory
}

export default function SubcategoryCard({ subcategory }: SubcategoryCardProps) {
  const router = useRouter()
  const [isUnlocking, setIsUnlocking] = useState(false)
  const { currency, removeCurrency } = useCurrencyStore()

  const answeredQuestion = subcategory.questions.filter(
    (q) => q.hasUserAnswered
  )

  async function handleUnlock() {
    try {
      setIsUnlocking(true)
      await removeCurrency(subcategory.unlockPrice)
      subcategory.isUnlocked = true
    } catch (error) {
      console.log(error)
    }
    setIsUnlocking(false)
  }

  function handleStartQuiz() {
    router.push(`/quiz?id=${subcategory.id}`)
  }
  return (
    <li className='relative text-center w-full bg-pink-300 pt-6 pb-10 px-8 rounded-2x flex flex-col gap-5 justify-between items-center shadow-xl rounded-2xl'>
      <h2 className='uppercase text-2xl font-light'>{subcategory.label}</h2>
      <div className='relative h-20 w-full flex justify-center'>
        <Image
          src={`/images/subcategory_icons/${subcategory.id}.png`}
          alt={`Obrázek kvízu s názvem "${subcategory.label}"`}
          fill
          sizes='100%'
          className='object-contain'
        />
      </div>

      <SubcategoryTracker
        answeredCount={answeredQuestion.length}
        questionCount={subcategory.questions.length}
      />
      {/* TODO: Implement subcategory explore */}
      {/* <LinkButton className='mb-2'>PROZKOUMAT</LinkButton> */}
      {subcategory.isUnlocked ? (
        <PrimaryButton fontSize='text-base' onClick={handleStartQuiz}>
          SPUSTIT
        </PrimaryButton>
      ) : (
        <>
          <PrimaryButton
            fontSize='text-base'
            bgColor='bg-amber-200'
            disabled={subcategory.unlockPrice > currency || isUnlocking}
            paddingY='py-[0.625rem]'
            className='flex justify-center'
            onClick={handleUnlock}
          >
            {isUnlocking ? (
              <LoadSpinner />
            ) : (
              <CurrencyDisplay value={-subcategory.unlockPrice} size='small' />
            )}
          </PrimaryButton>
        </>
      )}
      <div className='absolute right-4 bottom-3 uppercase text-xs text-gray-800/60'>
        {subcategory.category.label}
      </div>
    </li>
  )
}
