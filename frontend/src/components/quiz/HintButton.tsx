import Image from 'next/image'

import iconQuestion from '@/assets/icon_question.svg'
import iconClose from '@/assets/icon_close.svg'
import { useState } from 'react'
import PrimaryButton from '../common/PrimaryButton'
import CurrencyDisplay from '../CurrencyDisplay'
import { useCurrencyStore } from '@/stores/currency_store'

const HINT_PRICE = 2

type HintButtonProps = {
  onAccept: () => void
}

export default function HintButton({ onAccept }: HintButtonProps) {
  const removeCurrency = useCurrencyStore((state) => state.removeCurrency)
  const [isConfirmDisplayed, setIsConfirmDisplayed] = useState(false)

  const handleModaToggle = () => setIsConfirmDisplayed((state) => !state)
  async function handleAccept() {
    await removeCurrency(HINT_PRICE)
    setIsConfirmDisplayed(false)
    onAccept()
  }

  return (
    <>
      <button onClick={handleModaToggle} className='border-2 border-pink-400 bg-pink-300/80 rounded-full p-1'>
        <Image src={iconQuestion} width={24} height={24} alt='Nápověda' />
      </button>
      {isConfirmDisplayed && (
        <div className='fixed top-0 left-0 bottom-0 right-0 z-50'>
          <div className='bg-black/25 w-full h-full backdrop-blur-lg flex justify-center items-center px-8'>
            <div className='w-full max-w-sm bg-white text-center rounded-2xl overflow-clip p-6 space-y-6'>
              <button onClick={handleModaToggle} className='ml-auto block'>
                <Image src={iconClose} width={30} height={30} alt='Uzavřít' />
              </button>
              <p className='uppercase text-xl'>OPRAVDU CHCEŠ ODEBRAT DVĚ MOŽNOSTI? </p>
              <PrimaryButton bgColor='bg-yellow-300' onClick={handleAccept}>
                <CurrencyDisplay value={'-' + HINT_PRICE} />
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
