import { useUserStore } from '@/stores/user_store'

export default function AuthPage() {
  const login = useUserStore((state) => state.login)

  const handleLogin = () => login('Alfik', 'password')

  return (
    <>
      <h1 className='text-4xl'>AUTH PAGE</h1>
      <button
        className='bg-red-500 py-1 px-4 rounded-2xl hover:bg-red-300'
        onClick={handleLogin}
      >
        login
      </button>
    </>
  )
}
