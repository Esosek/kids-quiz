import Image from 'next/image'

import { useUserStore } from '@/stores/user_store'
import iconMap from '@/assets/icon_map.png'
import iconLogout from '@/assets/icon_logout.svg'
import LinkButton from './common/LinkButton'

export default function Header() {
  const { user, logout } = useUserStore()
  return (
    <header className='flex justify-between items-start w-full'>
      <div className='flex items-center'>
        <Image src={iconMap} width={40} height={40} alt='Map icon' />
        <div className='text-xl font-medium ml-1'>54</div>
      </div>
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
