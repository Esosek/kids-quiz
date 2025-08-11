import { Question } from '@/types/question'
import Header from './Header'
import SubcategoryCard from './subcategory/SubcategoryCard'

export default function Dashboard() {
  const subcategories = {
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
        { hasUserAnswered: true } as Question,
        { hasUserAnswered: true } as Question,
        { hasUserAnswered: true } as Question,
        { hasUserAnswered: false } as Question,
        { hasUserAnswered: false } as Question,
        { hasUserAnswered: false } as Question,
        { hasUserAnswered: false } as Question,
        { hasUserAnswered: false } as Question,
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
      questions: [
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
      ] as Question[],
    },
    '06a005ea-027e-4afc-a29f-8d4dbf760262': {
      label: 'Vesmír II',
      unlockPrice: 60,
      isUnlocked: false,
      category: {
        id: 'd0cb945e-c9f1-469e-9a96-6f9795941a9d',
        label: 'Vesmír',
      },
      questions: [
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
        { hasUserAnswered: false },
      ] as Question[],
    },
  }
  return (
    <>
      <Header />
      <ul className='gap-8 grid auto-rows-fr grid-cols-1 sm:grid-cols-2 w-full max-w-sm sm:max-w-none'>
        {Object.entries(subcategories).map(([subId, sub]) => (
          <SubcategoryCard key={subId} subcategory={{ id: subId, ...sub }} />
        ))}
      </ul>
    </>
  )
}
