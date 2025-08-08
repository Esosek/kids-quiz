import Image from 'next/image'

import logo from '@/assets/logo.png'
import { useUserStore } from '@/stores/user_store'
import PrimaryButton from './common/PrimaryButton'
import LinkButton from './common/LinkButton'
import { FormEvent, useState } from 'react'
import TextInput from './common/TextInput'
import AvatarPicker from './AvatarPicker'

export default function AuthPage() {
  const login = useUserStore((state) => state.login)
  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)

  const handleLogin = () => login('Alfik', 'password')
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    console.log(event.target)
  }

  return (
    <form onSubmit={handleSubmit} className='grid justify-items-center w-full'>
      <div className='max-w-[70%] h-auto relative flex flex-col items-center'>
        <Image
          src={logo}
          alt='Logo aplikace'
          width={512}
          height={512}
          priority
        />
      </div>
      <TextInput id='username' placeholder='PŘEZDÍVKA' />
      <TextInput id='password' type='password' placeholder='HESLO' />
      <div className='justify-self-start m-2 ml-4 flex items-center'>
        <input
          type='checkbox'
          name='keep-logged'
          id='logged'
          className=' accent-green-500 size-6'
          checked={keepLoggedIn}
          onChange={() => setKeepLoggedIn(!keepLoggedIn)}
        />
        <label htmlFor='keep-logged' className='uppercase ml-2'>
          zůstat přihlášen
        </label>
      </div>
      <PrimaryButton onClick={handleLogin}>
        {isRegistrationOpen ? 'VYTVOŘIT ÚČET' : 'PŘIHLÁSIT'}
      </PrimaryButton>
      {isRegistrationOpen && <AvatarPicker onChange={() => {}} />}
      <LinkButton onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}>
        {isRegistrationOpen ? 'ZPÁTKY K PŘIHLÁŠENÍ' : 'JSI TU POPRVÉ?'}
      </LinkButton>
    </form>
  )
}
