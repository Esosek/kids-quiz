import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { useUserStore } from '@/stores/user_store'
import iconLogout from '@/assets/icon_logout.svg'
import LinkButton from './common/LinkButton'
import { useCurrencyStore } from '@/stores/currency_store'
import CurrencyDisplay from './CurrencyDisplay'

export default function Header() {
  const pathName = usePathname()
  const { user, logout } = useUserStore()
  const { currency, addCurrency } = useCurrencyStore()
  return (
    <header className='relative flex justify-between items-start w-full mb-2 sm:mb-10'>
      <CurrencyDisplay value={currency} />
      {user?.id === process.env.NEXT_PUBLIC_ADMIN_ID && (
        <>
          <Link href={pathName === '/admin' ? '/' : '/admin'} className='uppercase underline'>
            {pathName === '/admin' ? 'dashboard' : 'admin sekce'}
          </Link>
          <button
            className='absolute left-0 bottom-2 bg-green-500 py-1 px-2 text-sm rounded-2xl'
            onClick={() => addCurrency(25)}
          >
            +25
          </button>
        </>
      )}
      <div className='grid justify-items-center gap-1'>
        <div className='size-10'>
          {user && <Image src={`/images/avatars/${user?.avatar}`} alt='User avatar' width={284} height={285} />}
        </div>
        <LinkButton className='flex gap-1 items-center' onClick={logout}>
          <div className='max-w-32 text-ellipsis overflow-clip font-medium'>{user?.username.toUpperCase()}</div>
          <Image src={iconLogout} width={16} height={16} alt='Logout icon' className='size-4' />
        </LinkButton>
      </div>
    </header>
  )
}
