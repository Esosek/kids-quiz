import Image from 'next/image'
import { useEffect, useState } from 'react'

type IconButtonProps = {
  iconSrc: string
  onClick: () => void
  alt?: string
  bgColor?: string
}

export default function IconButton({ iconSrc, onClick, alt = '', bgColor = 'bg-green-500' }: IconButtonProps) {
  const [scale, setScale] = useState('0%')
  useEffect(() => {
    setTimeout(() => {
      setScale('100%')
    }, 50)
  }, [])
  return (
    <button onClick={onClick} style={{ scale }} className={`${bgColor} flex justify-center size-13 rounded-full transition-transform duration-100 sm:size-14`}>
      <Image src={iconSrc} width={30} height={30} alt={alt} />
    </button>
  )
}
