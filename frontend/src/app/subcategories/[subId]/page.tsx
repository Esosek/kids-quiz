'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

import Header from '@/components/Header'
import { useCategoryStore } from '@/stores/category_store'
import SubcategoryTracker from '@/components/subcategory/SubcategoryTracker'
import PrimaryButton from '@/components/common/PrimaryButton'

export default function SubcategoryDetailPage() {
  const { subId } = useParams() as { subId: string }
  const router = useRouter()

  const subcategories = useCategoryStore((state) => state.subcategories)
  const subcategory = subcategories ? subcategories[subId] : undefined
  const subQuestions = subcategory ? subcategory.questions : []
  subQuestions.sort((a, b) => {
    if (a.hasUserAnswered && !b.hasUserAnswered) return -1
    if (!a.hasUserAnswered && b.hasUserAnswered) return 1
    return a.correctAnswer < b.correctAnswer ? -1 : 1
  })

  function handleQuizStart() {
    router.push('/quiz?id=' + subId)
  }

  return subcategory ? (
    <main className='relative text-center pb-16'>
      <Header />
      <h1 className='absolute top-8 left-0 right-0 text-2xl uppercase mb-6 sm:top-16'>{subcategories![subId].label}</h1>
      <div className='max-w-sm mx-auto'>
        <SubcategoryTracker
          answeredCount={subQuestions.filter((q) => q.hasUserAnswered).length}
          questionCount={subQuestions.length}
        />
        {subcategories![subId].isUnlocked && (
          <PrimaryButton fontSize='text-lg' className='mt-6' onClick={handleQuizStart}>
            SPUSTIT KVÍZ
          </PrimaryButton>
        )}
      </div>
      <ul className='grid grid-cols-1 gap-3 auto-rows-fr my-6 sm:grid-cols-2'>
        {subQuestions.map((question) => (
          <li
            key={question.id}
            className='grid justify-items-center gap-2 border-2 border-red-200 text-center rounded-2xl py-2 px-1 uppercase text-sm font-light'
          >
            <p>{question.text}</p>
            {question.imgUrl && (
              <Image src={question.imgUrl} alt='Obrázek k otázce' width={64} height={64} className='h-16 w-auto' />
            )}
            <p className='font-medium self-end'>
              {question.hasUserAnswered ? (
                question.correctAnswer
              ) : (
                <span className='italic font-light'>Zatím jsi neodpověděl</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </main>
  ) : (
    <p className='text-center'>Kvíz neexistuje...</p>
  )
}
