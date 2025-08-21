import { ReactNode } from 'react'

type LinkButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  disabled?: boolean
}

export default function LinkButton(props: LinkButtonProps) {
  return (
    <button
      onClick={props.onClick}
      type={props.type ?? 'button'}
      disabled={props.disabled ?? false}
      className={`${props.className ?? ''} underline`}
    >
      {props.children}
    </button>
  )
}
