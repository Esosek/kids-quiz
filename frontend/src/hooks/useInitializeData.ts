import { useEffect, useState } from 'react'

import type User from '@/types/user'
import { fetchRequest } from '@/utils/fetch_request'
import { useCurrencyStore } from '@/stores/currency_store'
import { useUserStore } from '@/stores/user_store'
import { Subcategory } from '@/types/subcategory'
import { useCategoryStore } from '@/stores/category_store'

type UserData =
  | {
      user: User & { currency: number }
      categories: Record<string, { id: string; label: string }>
      subcategories: Record<string, Subcategory>
    }
  | undefined
/**
 * @returns [userData, hasDataLoaded]
 */
export const useInitializeData = (): [UserData | null, boolean] => {
  const { user, initializeUser } = useUserStore()
  const initializeCurrency = useCurrencyStore((state) => state.initializeCurrency)
  const initializeCategoryData = useCategoryStore((state) => state.initialize)
  const [userData, setUserData] = useState<UserData | null>(undefined)
  const [hasDataLoaded, setHasDataLoaded] = useState(false)

  useEffect(() => {
    const tokenStorageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY
    if (!tokenStorageKey) {
      console.warn(`Environment variable NEXT_PUBLIC_TOKEN_STORAGE_KEY is not set`)
    } else {
      const token = localStorage.getItem(tokenStorageKey) ?? user?.token
      if (token) {
        fetchUserData(token)
      } else {
        setUserData(null)
        setHasDataLoaded(true)
      }
    }

    async function fetchUserData(token: string) {
      try {
        const { body } = await fetchRequest('/initialize', 'GET', undefined, token)
        const validatedBody = validateBody(body)!

        if (!user) {
          const { id, avatar, username, currency } = validatedBody.user
          initializeCurrency(currency)
          initializeUser({ id, avatar, username, token })
        }

        initializeCategoryData({ categories: validatedBody.categories, subcategories: validatedBody.subcategories })
        setUserData(validatedBody)
        setHasDataLoaded(true)
      } catch (error) {
        console.log(error)
      }
    }
  }, [initializeUser, initializeCurrency, initializeCategoryData, user])

  return [userData, hasDataLoaded]
}

function validateBody(body: unknown): UserData {
  if (!body) {
    throw new Error('Body is missing')
  }

  const validatedBody = body as UserData

  if (!validatedBody?.user) {
    throw new Error('User data is missing')
  }

  if (!validatedBody?.categories) {
    throw new Error('Category data is missing')
  }

  if (!validatedBody?.subcategories) {
    throw new Error('Subcategory data is missing')
  }

  return {
    user: validatedBody.user,
    categories: validatedBody.categories,
    subcategories: validatedBody.subcategories,
  }
}
