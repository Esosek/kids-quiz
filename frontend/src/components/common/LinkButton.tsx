import { ReactNode } from 'react'

type LinkButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
}

export default function LinkButton(props: LinkButtonProps) {
  return (
    <button
      onClick={props.onClick}
      type={props.type ?? 'button'}
      className={`${props.className ?? ''} underline my-4`}
    >
      {props.children}
    </button>
  )
}
