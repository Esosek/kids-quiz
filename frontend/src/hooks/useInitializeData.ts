import { useCurrencyStore } from '@/stores/currency_store'
import { useUserStore } from '@/stores/user_store'
import { Subcategory } from '@/types/subcategory'
import User from '@/types/user'
import { useEffect, useState } from 'react'

type UserData =
  | {
      user: User
      categories: Record<string, { id: string; label: string }>
      subcategories: Record<string, Subcategory>
    }
  | undefined

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
          hasUserAnswered: true,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: '2413900e-4068-4d4e-b3fa-19384631cd55',
          correctAnswer: 'Jupiter',
          answers: ['Jupiter', 'Saturn', 'Pluto', 'Merkur', 'Plynný obr'],
          imgUrl: null,
          text: 'Jaká je největší planeta sluneční soustavy?',
          hasUserAnswered: true,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'a1b2c3d4-e567-4890-8123-f45678901234',
          correctAnswer: 'Slunce',
          answers: ['Slunce', 'Měsíc', 'Mars', 'Venuše', 'Hvězda'],
          imgUrl: null,
          text: 'Co je středem naší sluneční soustavy?',
          hasUserAnswered: true,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'b2c3d4e5-f678-4901-8234-g56789012345',
          correctAnswer: 'Měsíc',
          answers: ['Měsíc', 'Slunce', 'Mars', 'Jupiter', 'Kometa'],
          imgUrl: null,
          text: 'Jak se jmenuje přirozená družice Země?',
          hasUserAnswered: true,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'c3d4e5f6-g789-4012-8345-h67890123456',
          correctAnswer: '8',
          answers: ['6', '7', '8', '9', '10'],
          imgUrl: null,
          text: 'Z kolika planet se skládá naše sluneční soustava?',
          hasUserAnswered: true,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'd4e5f6g7-h890-4123-8456-i78901234567',
          correctAnswer: 'Merkur',
          answers: ['Merkur', 'Venuše', 'Mars', 'Jupiter', 'Země'],
          imgUrl: null,
          text: 'Která planeta je nejblíže Slunci?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'g7h8i9j0-k123-4456-8789-l01234567890',
          correctAnswer: 'Mars',
          answers: ['Venuše', 'Mars', 'Jupiter', 'Saturn', 'Uran'],
          imgUrl: null,
          text: 'Která planeta je známá jako "rudá planeta"?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'h8i9j0k1-l234-4567-8890-m12345678901',
          correctAnswer: 'Venuše',
          answers: ['Země', 'Mars', 'Venuše', 'Jupiter', 'Merkur'],
          imgUrl: null,
          text: 'Která planeta je nejteplejší?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'k1l2m3n4-o567-4890-8123-p45678901234',
          correctAnswer: 'Pluto',
          answers: ['Pluto', 'Měsíc', 'Mars', 'Ceres', 'Eris'],
          imgUrl: null,
          text: 'Které těleso bylo dříve považováno za planetu, ale nyní je trpasličí planeta?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'l2m3n4o5-p678-4901-8234-q56789012345',
          correctAnswer: 'Mléčná dráha',
          answers: ['Andromeda', 'Mléčná dráha', 'Triangulum', 'Sombrero', 'Vír'],
          imgUrl: null,
          text: 'Jak se jmenuje naše galaxie?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'm3n4o5p6-q789-4012-8345-r67890123456',
          correctAnswer: 'Hvězda',
          answers: ['Planeta', 'Kometa', 'Hvězda', 'Měsíc', 'Asteroid'],
          imgUrl: null,
          text: 'Co je Slunce?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'n4o5p6q7-r890-4123-8456-s78901234567',
          correctAnswer: 'Kometa',
          answers: ['Asteroid', 'Meteorit', 'Kometa', 'Planeta', 'Hvězda'],
          imgUrl: null,
          text: 'Co má ocas a obíhá kolem Slunce?',
          hasUserAnswered: false,
          subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
        },
        {
          id: 'p6q7r8s9-t012-4345-8678-u90123456789',
          correctAnswer: 'Meteorit',
          answers: ['Asteroid', 'Kometa', 'Meteorit', 'Planeta', 'Hvězda'],
          imgUrl: null,
          text: 'Co vznikne, když meteor dopadne na Zemi?',
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

export const useInitializeData = () => {
  const initializeUser = useUserStore((state) => state.initializeUser)
  const setCurrency = useCurrencyStore((state) => state.setCurrency)
  const [userData, setUserData] = useState<UserData>(undefined)

  useEffect(() => {
    const tokenStorageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY
    if (!tokenStorageKey) {
      console.warn(`Environment variable NEXT_PUBLIC_TOKEN_STORAGE_KEY is not set`)
    } else {
      const token = localStorage.getItem(tokenStorageKey)
      if (token) {
        fetchUserData(token)
      }
    }

    async function fetchUserData(token: string) {
      try {
        // TODO: Connect fetchUserData to backend
        const { id, avatar, username, currency } = MOCK_DATA.user
        initializeUser({ id, avatar, username, token })
        setCurrency(currency)
        setUserData(MOCK_DATA as unknown as UserData)
      } catch (error) {
        console.log(error)
      }
    }
  }, [initializeUser, setCurrency])

  return userData
}
