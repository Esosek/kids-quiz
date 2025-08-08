import Image from 'next/image'
import { useState } from 'react'

import iconVisibility from '@/assets/icon_visibility.svg'
import iconVisibilityOff from '@/assets/icon_visibility_off.svg'

type TextInputProps = {
  id: string
  value?: string
  type?: string
  placeholder?: string
  error?: string
  onChange?: (value: string) => void
}

export default function TextInput(props: TextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  let type = 'text'

  if (props.type) {
    type = props.type
  }

  if (isPasswordVisible) {
    type = 'text'
  }

  function handleToggleVisibility() {
    setIsPasswordVisible(!isPasswordVisible)
  }
  return (
    <div
      className={`relative w-full border-2 rounded-full my-1 focus-within:border-green-500 focus-within:ring-green-500 focus-within:ring-1 ${
        props.error ? 'mt-4 border-red-600' : 'border-green-700'
      }`}
    >
      {props.error && (
        <p className='absolute text-red-600 uppercase text-sm -top-5 left-5'>
          {props.error}
        </p>
      )}
      <input
        name={props.id}
        id={props.id}
        type={type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={
          props.onChange ? (e) => props.onChange!(e.target.value) : undefined
        }
        className={`text-2xl uppercase text-center w-full h-full py-3 rounded-full overflow-clip focus:outline-none placeholder:text-green-800/45 ${
          props.error ? 'text-red-600' : 'text-black'
        }`}
      />
      <button
        type='button'
        onClick={handleToggleVisibility}
        className='absolute right-8 top-0 bottom-0'
      >
        {props.type === 'password' && (
          <Image
            src={isPasswordVisible ? iconVisibilityOff : iconVisibility}
            width={24}
            height={24}
            alt='Eye icon'
            className='size-10 opacity-50'
          />
        )}
      </button>
    </div>
  )
}
