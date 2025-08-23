'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Header from '@/components/Header'
import Quiz from '@/components/quiz/Quiz'
import { useCategoryStore } from '@/stores/category_store'

function QuizSuspense() {
  const subcategoryId = useSearchParams().get('id')
  const router = useRouter()
  const subcategories = useCategoryStore((state) => state.subcategories)

  useEffect(() => {
    if (!subcategories || !subcategoryId || !subcategories[subcategoryId]) {
      router.push('/')
    }
  }, [router, subcategories, subcategoryId])

  return (
    <>
      <Header />
      {subcategories && subcategoryId && subcategories[subcategoryId] && (
        <Quiz subcategory={subcategories[subcategoryId]} />
      )}
    </>
  )
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizSuspense />
    </Suspense>
  )
}
