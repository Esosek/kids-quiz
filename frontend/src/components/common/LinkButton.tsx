import { ReactNode } from 'react'

type LinkButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export default function LinkButton(props: LinkButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`${props.className ?? ''} underline my-4`}
    >
      {props.children}
    </button>
  )
}
