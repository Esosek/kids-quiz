'use client'
import LoadSpinner from '@/components/common/LoadSpinner'
import { useInitializeData } from '@/hooks/useInitializeData'
import { useUserStore } from '@/stores/user_store'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function QuizPage() {
  const router = useRouter()
  const subcategoryId = useSearchParams().get('id')

  const userData = useInitializeData()
  const { user } = useUserStore()

  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (userData) {
      setDataLoaded(true)
    }
  }, [userData])

  useEffect(() => {
    if (dataLoaded && !user) {
      router.push('/')
    }
  }, [router, user, dataLoaded])
  return dataLoaded ? (
    <div>QUIZ PAGE ID {subcategoryId}</div>
  ) : (
    <div className='grid justify-items-center gap-4'>
      Nahrávám uživatelská data...
      <LoadSpinner />
    </div>
  )
}
