import { ReactNode } from 'react'

type PrimaryButtonProps = {
  children: ReactNode
  onClick?: () => void
  bgColor?: string
  fontSize?: string
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  paddingY?: string
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
      }
      ${props.paddingY ?? 'py-3'} ${
        props.className
      } font-medium px-9 w-full max-w-lg rounded-full shadow-lg`}
    >
      {props.children}
    </button>
  )
}
