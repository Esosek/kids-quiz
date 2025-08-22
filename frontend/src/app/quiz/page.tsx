'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import LoadSpinner from '@/components/common/LoadSpinner'
import { useInitializeData } from '@/hooks/useInitializeData'
import { useUserStore } from '@/stores/user_store'
import Header from '@/components/Header'
import Quiz from '@/components/quiz/Quiz'

function QuizSuspense() {
  const router = useRouter()
  const subcategoryId = useSearchParams().get('id')

  const [userData, hasDataLoaded] = useInitializeData()
  const { user } = useUserStore()

  useEffect(() => {
    if (hasDataLoaded && (!user || !subcategoryId)) {
      router.push('/')
    }
  }, [router, user, hasDataLoaded, subcategoryId])
  return hasDataLoaded && userData ? (
    <>
      <Header />
      <Quiz subcategory={userData!.subcategories[subcategoryId!]} />
    </>
  ) : (
    <div className='grid justify-items-center gap-4'>
      Nahrávám uživatelská data...
      <LoadSpinner />
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizSuspense />
    </Suspense>
  )
}
