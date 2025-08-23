'use client'
import Image from 'next/image'

import logo from '@/assets/logo.png'
import { useUserStore } from '@/stores/user_store'
import PrimaryButton from '@/components/common/PrimaryButton'
import LinkButton from '@/components/common/LinkButton'
import { FormEvent, useState } from 'react'
import CommonInput from '@/components/common/CommonInput'
import AvatarPicker from '@/components/AvatarPicker'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useUserStore()

  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('')

  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function handleUsernameChange(value: string) {
    setUsernameError('')
    setUsername(value)
  }

  function handlePasswordChange(value: string) {
    setPasswordError('')
    setPassword(value)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!isFormValid()) {
      return
    }

    let result: { ok: boolean; error?: string }
    if (isRegistrationOpen) {
      result = await register(username, password, selectedAvatar, keepLoggedIn)
    } else {
      result = await login(username, password, keepLoggedIn)
    }

    if (!result.ok && result.error) {
      if (/\bheslo\b/.test(result.error)) {
        setPasswordError(result.error!)
      } else setUsernameError(result.error!)
    } else {
      router.push('/')
    }
  }

  function isFormValid() {
    let result = true
    if (!username.trim().length) {
      setUsernameError('prosím vyplň svou přezdívku')
      result = false
    } else if (username.length < 3) {
      setUsernameError('přezdívka je příliš krátká')
      result = false
    } else if (username.length > 32) {
      setUsernameError('přezdívka je příliš dlouhá')
      result = false
    }
    if (!password.trim().length) {
      setPasswordError('prosím vyplň heslo')
      result = false
    } else if (password.length < 8) {
      setPasswordError('heslo je příliš krátké')
      result = false
    } else if (password.length > 64) {
      setPasswordError('heslo je příliš dlouhé')
      result = false
    }
    return result
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className='grid justify-items-center w-full'>
        <div className='max-w-[50%] h-auto relative flex flex-col items-center'>
          <Image src={logo} alt='Logo aplikace' width={512} height={512} priority />
        </div>
        <CommonInput
          id='username'
          placeholder='PŘEZDÍVKA'
          value={username}
          onChange={(value) => handleUsernameChange(value)}
          error={usernameError}
        />
        <CommonInput
          id='password'
          type='password'
          placeholder='HESLO'
          value={password}
          onChange={(value) => handlePasswordChange(value)}
          error={passwordError}
        />
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
        <PrimaryButton type='submit' className='my-4'>
          {isRegistrationOpen ? 'VYTVOŘIT ÚČET' : 'PŘIHLÁSIT'}
        </PrimaryButton>
        {isRegistrationOpen && <AvatarPicker value={selectedAvatar} onChange={(avatar) => setSelectedAvatar(avatar)} />}
        <LinkButton onClick={() => setIsRegistrationOpen(!isRegistrationOpen)} className='my-4'>
          {isRegistrationOpen ? 'ZPÁTKY K PŘIHLÁŠENÍ' : 'JSI TU POPRVÉ?'}
        </LinkButton>
      </form>
    </main>
  )
}
