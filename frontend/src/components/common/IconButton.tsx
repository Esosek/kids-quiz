import Image from 'next/image'
import { useEffect, useState } from 'react'

type IconButtonProps = {
  iconSrc: string
  onClick: () => void
  alt?: string
}

export default function IconButton({ iconSrc, onClick, alt = '' }: IconButtonProps) {
  const [scale, setScale] = useState('0%')
  useEffect(() => {
    setTimeout(() => {
      setScale('100%')
    }, 50)
  }, [])
  return (
    <button onClick={onClick} style={{ scale }} className='flex justify-center size-13 bg-green-500 rounded-full transition-transform duration-100 sm:size-14'>
      <Image src={iconSrc} width={30} height={30} alt={alt} />
    </button>
  )
}
