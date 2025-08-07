import { ReactNode } from 'react'

type PrimaryButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export default function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`${
        props.className ?? 'bg-green-500'
      } text-2xl font-medium py-3 px-9 w-full max-w-lg rounded-full shadow-lg`}
    >
      {props.children}
    </button>
  )
}
