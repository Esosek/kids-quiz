'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import LoadSpinner from '@/components/common/LoadSpinner'
import { useInitializeData } from '@/hooks/useInitializeData'
import { useUserStore } from '@/stores/user_store'
import Header from '@/components/Header'
import Quiz from '@/components/quiz/Quiz'

export default function QuizPage() {
  const router = useRouter()
  const subcategoryId = useSearchParams().get('id')

  const userData = useInitializeData()
  const { user } = useUserStore()

  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (userData !== undefined) {
      setDataLoaded(true)
    }
  }, [userData])

  useEffect(() => {
    if (dataLoaded && (!user || !subcategoryId)) {
      router.push('/')
    }
  }, [router, user, dataLoaded, subcategoryId])
  return dataLoaded && userData ? (
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
