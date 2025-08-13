import Image from 'next/image'

import iconClose from '@/assets/icon_close.svg'
import iconCheck from '@/assets/icon_check.svg'
import iconQuestion from '@/assets/icon_question.svg'

type AnswerIndicatorProps = {
  answer: true | false | 'current' | undefined
}

export default function AnswerIndicator({ answer }: AnswerIndicatorProps) {
  let indicatorColors = 'border-black/25'
  let indicatorIcon = iconQuestion

  switch (answer) {
    case true:
      indicatorColors = 'bg-green-500 border-green-600'
      indicatorIcon = iconCheck
      break
    case false:
      indicatorColors = 'bg-red-500 border-red-600'
      indicatorIcon = iconClose
      break
    case 'current':
      indicatorColors = 'border-yellow-400 bg-yellow-300'
      break

    default:
      break
  }
  return (
    <div className={`${indicatorColors} size-[1.6rem] sm:size-8 border-2 rounded-full flex items-center justify-center`}>
      <Image src={indicatorIcon} width={20} height={20} alt='Check icon' className={`${answer === undefined ? 'opacity-50' : ''} size-4 sm:size-5`} />
    </div>
  )
}
