import { useRouter } from 'next/navigation'

import IconButton from '../common/IconButton'
import CurrencyDisplay from '../CurrencyDisplay'
import SubcategoryTracker from '../subcategory/SubcategoryTracker'
import iconHome from '@/assets/icon_home.svg'
import iconReplay from '@/assets/icon_replay.svg'
import { useCategoryStore } from '@/stores/category_store'

type QuizResultProps = {
  userAnswers: boolean[]
  subcategoryId: string
  currencyEarned: number
  onReplay: () => void
}

export default function QuizResult({ userAnswers, subcategoryId, currencyEarned, onReplay }: QuizResultProps) {
  const router = useRouter()
  const correctCount = userAnswers.filter((a) => a).length
  const subcategories = useCategoryStore((state) => state.subcategories)
  const answeredQuestions = subcategories![subcategoryId].questions.filter((q) => q.hasUserAnswered).length

  const handleReplay = () => onReplay()
  const handleHome = () => router.push('/')

  return (
    <div className='flex flex-col text-center gap-8 justify-center items-center w-full'>
      <h2 className='uppercase mt-12 text-xl'>
        {correctCount > Math.floor(userAnswers.length / 2) ? 'Gratulujeme!' : 'Zkus to znovu'}
      </h2>
      <p className='flex gap-1 items-center justify-center uppercase '>
        <span className='text-3xl font-medium'>{correctCount}</span>
        <span className='text-sm'>{` / ${userAnswers.length} správně`}</span>
      </p>
      <CurrencyDisplay value={'+' + currencyEarned} />
      <div className='w-4/5'>
        <p className='uppercase'>Postup kategorie</p>
        <SubcategoryTracker
          answeredCount={answeredQuestions}
          questionCount={subcategories![subcategoryId].questions.length}
        />
      </div>
      <div className='flex absolute bottom-6 justify-around w-full gap-16 sm:mt-8 sm:static sm:justify-center'>
        <IconButton iconSrc={iconHome} onClick={handleHome} alt='Home icon' bgColor='bg-pink-300' />
        <IconButton iconSrc={iconReplay} onClick={handleReplay} alt='Replay icon' />
      </div>
    </div>
  )
}
