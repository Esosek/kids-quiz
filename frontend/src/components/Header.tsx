import Image from 'next/image'

import { useUserStore } from '@/stores/user_store'
import iconLogout from '@/assets/icon_logout.svg'
import LinkButton from './common/LinkButton'
import { useCurrencyStore } from '@/stores/currency_store'
import CurrencyDisplay from './CurrencyDisplay'

export default function Header() {
  const { user, logout } = useUserStore()
  const currency = useCurrencyStore((state) => state.currency)
  return (
    <header className='flex justify-between items-start w-full mb-16'>
      <CurrencyDisplay value={currency} />
      <div className='grid justify-items-center gap-1'>
        <div className='size-10'>
          <Image
            src={`/images/avatars/${user?.avatar}`}
            alt='User avatar'
            width={284}
            height={285}
          />
        </div>
        <LinkButton className='flex gap-1' onClick={logout}>
          <div className='max-w-32 text-ellipsis overflow-clip font-medium'>
            {user?.username.toUpperCase()}
          </div>
          <Image src={iconLogout} width={16} height={16} alt='Logout icon' />
        </LinkButton>
      </div>
    </header>
  )
}
