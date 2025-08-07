import { useUserStore } from '@/stores/user_store'

export default function Dashboard() {
  const logout = useUserStore((state) => state.logout)
  return (
    <>
      <h1 className='text-4xl'>DASHBOARD PAGE</h1>
      <button
        className='bg-red-500 py-1 px-4 rounded-2xl hover:bg-red-300'
        onClick={logout}
      >
        logout
      </button>
    </>
  )
}
