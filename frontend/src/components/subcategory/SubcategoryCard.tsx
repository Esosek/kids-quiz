import { type Subcategory } from '@/types/subcategory'
import SubcategoryTracker from './SubcategoryTracker'
import CurrencyDisplay from '../CurrencyDisplay'
import PrimaryButton from '../common/PrimaryButton'
import { useCurrencyStore } from '@/stores/currency_store'
// import LinkButton from '../common/LinkButton'

type SubcategoryCardProps = {
  subcategory: Subcategory
}

export default function SubcategoryCard({ subcategory }: SubcategoryCardProps) {
  const { currency } = useCurrencyStore()
  return (
    <li className='relative text-center w-full bg-pink-300 pt-6 pb-10 px-8 rounded-2x flex flex-col gap-6 justify-between shadow-xl rounded-2xl'>
      <h2 className='uppercase text-2xl font-light'>{subcategory.label}</h2>
      {subcategory.isUnlocked ? (
        <>
          <SubcategoryTracker answeredCount={5} questionCount={10} />
          <div>
            {/* TODO: Implement subcategory explore */}
            {/* <LinkButton className='mb-2'>PROZKOUMAT</LinkButton> */}
            <PrimaryButton fontSize='text-base'>SPUSTIT</PrimaryButton>
          </div>
        </>
      ) : (
        <>
          <CurrencyDisplay value={subcategory.unlockPrice} />
          <PrimaryButton
            fontSize='text-base'
            bgColor='bg-amber-200'
            disabled={subcategory.unlockPrice > currency}
          >
            ODEMKNOUT
          </PrimaryButton>
        </>
      )}
      <div className='absolute right-4 bottom-3 uppercase text-xs text-gray-800/60'>
        {subcategory.category.label}
      </div>
    </li>
  )
}
