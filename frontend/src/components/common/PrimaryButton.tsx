import { ReactNode } from 'react'

type PrimaryButtonProps = {
  children: ReactNode
  onClick?: () => void
  bgColor?: string
  fontSize?: string
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  disabled?: boolean
}

export default function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <button
      onClick={props.onClick}
      type={props.type ?? 'button'}
      disabled={props.disabled}
      className={`${props.bgColor ?? 'bg-green-500'} ${
        props.fontSize ?? 'text-2xl'
      } ${
        props.className
      } font-medium py-3 px-9 w-full max-w-lg rounded-full shadow-lg`}
    >
      {props.children}
    </button>
  )
}
