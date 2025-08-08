import Image from 'next/image'
import { useState } from 'react'

export default function AvatarPicker() {
  const images = [
    'elephant',
    'giraffe',
    'hippo',
    'monkey',
    'panda',
    'parrot',
    'penguin',
    'pig',
    'rabbit',
    'snake',
  ]

  const randomIndex = Math.round(Math.random() * (images.length - 1))

  const [selectedAvatar, setSelectedAvatar] = useState(images[randomIndex])

  return (
    <div className='my-8 text-center'>
      <h2 className='mb-4'>VYBER SI SVŮJ OBRÁZEK</h2>
      <ul className='flex gap-3'>
        {images.map((image) => (
          <li key={image}>
            <button
              type='button'
              onClick={() => setSelectedAvatar(image)}
              className={`${
                image === selectedAvatar &&
                'outline-5 outline-offset-2 outline-green-500'
              } rounded-full `}
            >
              <Image
                src={`/images/avatars/${image}.png`}
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
