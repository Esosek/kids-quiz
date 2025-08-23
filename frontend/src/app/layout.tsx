'use client'
import { Rubik } from 'next/font/google'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import './globals.css'

import { useInitializeData } from '@/hooks/useInitializeData'
import { useUserStore } from '@/stores/user_store'
import LoadSpinner from '@/components/common/LoadSpinner'

const rubik = Rubik({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const hasDataLoaded = useInitializeData()[1]
  const { user } = useUserStore()

  useEffect(() => {
    if (hasDataLoaded && !user) {
      router.push('/login')
    }
  }, [router, user, hasDataLoaded, pathname])
  return (
    <html lang='cs'>
      <body className={`${rubik.className} relative max-w-2xl mx-auto p-6 h-lvh`}>
        {hasDataLoaded ? (
          children
        ) : (
          <div className='grid justify-items-center gap-4'>
            Nahrávám uživatelská data...
            <LoadSpinner />
          </div>
        )}
      </body>
    </html>
  )
}
