import Image from 'next/image'
import { useEffect, useMemo } from 'react'

type AvatarPickerProps = {
  value: string
  onChange: (avatar: string) => void
}

export default function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  const images = useMemo(
    () => [
      'elephant.png',
      'giraffe.png',
      'hippo.png',
      'monkey.png',
      'panda.png',
      'parrot.png',
      'penguin.png',
      'pig.png',
      'rabbit.png',
      'snake.png',
    ],
    []
  )

  useEffect(() => {
    const randomIndex = Math.round(Math.random() * (images.length - 1))
    handleSelectAvatar(images[randomIndex])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSelectAvatar(avatar: string) {
    onChange(avatar)
  }

  return (
    <div className='my-8 text-center'>
      <h2 className='mb-4'>VYBER SI SVŮJ OBRÁZEK</h2>
      <ul className='flex gap-3'>
        {images.map((image) => (
          <li key={image}>
            <button
              type='button'
              onClick={() => handleSelectAvatar(image)}
              className={`${
                image === value &&
                'outline-5 outline-offset-2 outline-green-500'
              } rounded-full `}
            >
              <Image
                src={`/images/avatars/${image}`}
                alt={`${image} avatar`}
                width={284}
                height={285}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
