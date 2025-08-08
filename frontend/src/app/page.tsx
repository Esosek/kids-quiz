'use client'
import { useEffect } from 'react'

import { useUserStore } from '@/stores/user_store'
import AuthPage from '@/components/AuthPage'
import Dashboard from '@/components/Dashboard'
import { useCurrencyStore } from '@/stores/currency_store'

const MOCK_DATA = {
  user: {
    id: 'def286fe-18b7-44d3-af7c-cbfda63084b3',
    username: 'user',
    currency: 52,
    avatar: 'monkey.png',
    createdAt: '2025-07-31T16:05:07.095Z',
    updatedAt: '2025-08-04T16:42:47.866Z',
  },
  categories: {
    'd0cb945e-c9f1-469e-9a96-6f9795941a9d': {
      label: 'Vesmír',
      createdAt: '2025-07-31T15:02:59.683Z',
      updatedAt: '2025-07-31T15:02:59.683Z',
    },
    'c138ffa9-5e37-496b-85ba-e9c4322155b6': {
      label: 'Dopravní značky',
      createdAt: '2025-08-04T18:43:43.748Z',
      updatedAt: '2025-08-04T18:43:43.748Z',
    },
    '4889c4d5-c1ce-401e-9158-3d72d3c3f4e8': {
      label: 'Geografie',
      createdAt: '2025-08-04T18:44:16.355Z',
      updatedAt: '2025-08-04T18:44:16.355Z',
    },
  },
  subcategories: {
    '0043417e-e04b-4bd5-b940-bf8ef8b02e1f': {
      label: 'Vesmír I',
      unlockPrice: 0,
      isUnlocked: true,
      category: {
        id: 'd0cb945e-c9f1-469e-9a96-6f9795941a9d',
        label: 'Vesmír',
      },
      questions: [
        {
          id: '80ba6538-f2e8-4ddc-a13c-f46d426e7bec',
          correctAnswer: 'Lajka',
          answers: ['Lajka', 'Bajka', 'Hafka', 'Rex', '51234'],
          imgUrl: null,
          text: 'Jak se jmenovalo první zvíře vyslané lidmi do vesmíru?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: '2413900e-4068-4d4e-b3fa-19384631cd55',
          correctAnswer: 'Jupiter',
          answers: ['Jupiter', 'Saturn', 'Pluto', 'Merkur', 'Plynný obr'],
          imgUrl: null,
          text: 'Jaká je největší planeta sluneční soustavy?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
      ],
    },
    '2eba7916-cc4b-4611-9b28-4873f0603213': {
      label: 'Zákazové značky I',
      unlockPrice: 50,
      isUnlocked: false,
      category: {
        id: 'c138ffa9-5e37-496b-85ba-e9c4322155b6',
        label: 'Dopravní značky',
      },
      questions: [],
    },
    '06a005ea-027e-4afc-a29f-8d4dbf760262': {
      label: 'Vesmír II',
      unlockPrice: 50,
      isUnlocked: true,
      category: {
        id: 'd0cb945e-c9f1-469e-9a96-6f9795941a9d',
        label: 'Vesmír',
      },
      questions: [],
    },
  },
}

export default function Home() {
  const { user, initializeUser } = useUserStore()
  const setCurrency = useCurrencyStore((state) => state.setCurrency)

  useEffect(() => {
    const tokenStorageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY
    if (!tokenStorageKey) {
      console.warn(
        `Environment variable NEXT_PUBLIC_TOKEN_STORAGE_KEY is not set`
      )
    } else {
      const token = localStorage.getItem(tokenStorageKey)
      if (token) {
        fetchUserData(token)
      }
    }

    async function fetchUserData(token: string) {
      try {
        const { id, avatar, username, currency } = MOCK_DATA.user
        initializeUser({ id, avatar, username, token })
        setCurrency(currency)
      } catch (error) {
        console.log(error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return !user ? <AuthPage /> : <Dashboard />
}
