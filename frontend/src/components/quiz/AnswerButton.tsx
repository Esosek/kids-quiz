type AnswerButtonProps = {
  value: string
  disabled: boolean
  onClick: (value: string) => void
  colorTheme?: 'correct' | 'user-correct' | 'user'
}

export default function AnswerButton({ value, onClick, disabled, colorTheme }: AnswerButtonProps) {
  let themeStyles = 'bg-green-500/10 border-green-500'

  switch (colorTheme) {
    case 'user':
      themeStyles = 'bg-red-600/50 border-red-600/50'
      break
    case 'correct':
      themeStyles = 'bg-yellow-400 border-yellow-400'
      break
    case 'user-correct':
      themeStyles = 'bg-lime-500 border-lime-500'
      break
    default:
      break
  }
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={() => onClick(value)}
      style={{ opacity: '75%' }}
      className={`${themeStyles} border-2 rounded-[1.25rem] w-full h-full py-3 uppercase hover:not-disabled:bg-green-500/25 sm:bg-none sm:rounded-3xl`}
    >
      {value}
    </button>
  )
}
