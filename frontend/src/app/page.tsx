'use client'
import AuthPage from '@/components/AuthPage'
import Dashboard from '@/components/Dashboard'
import { useInitializeData } from '@/hooks/useInitializeData'

export default function Home() {
  const userData = useInitializeData()

  return !userData ? <AuthPage /> : <Dashboard />
}
