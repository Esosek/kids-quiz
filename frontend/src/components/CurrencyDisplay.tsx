import Image from 'next/image'

import iconMap from '@/assets/icon_map.png'

type CurrencyDisplayProps = {
  value: number
  size?: 'small' | 'large'
}

export default function CurrencyDisplay({
  value,
  size = 'large',
}: CurrencyDisplayProps) {
  let iconDimensions = 40
  if (size === 'small') {
    iconDimensions = 25
  }

  return (
    <div className='flex items-center justify-center'>
      <Image
        src={iconMap}
        width={iconDimensions}
        height={iconDimensions}
        alt='Map icon'
      />
      <div className='text-xl font-medium ml-1'>{value}</div>
    </div>
  )
}
