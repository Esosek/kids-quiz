import Image from 'next/image'

import iconMap from '@/assets/icon_map.png'

type CurrencyDisplayProps = {
  value: number
}

export default function CurrencyDisplay({ value }: CurrencyDisplayProps) {
  return (
    <div className='flex items-center justify-center'>
      <Image src={iconMap} width={40} height={40} alt='Map icon' />
      <div className='text-xl font-medium ml-1'>{value}</div>
    </div>
  )
}
