type AnswerButtonProps = {
  value: string
  onClick: (value: string) => void
}

export default function AnswerButton({ value, onClick }: AnswerButtonProps) {
  return (
    <button
      type='button'
      onClick={() => onClick(value)}
      className='bg-green-500/10 border-2 border-green-500 rounded-[1.25rem] w-full py-3 uppercase hover:bg-green-500/25 sm:bg-none sm:rounded-3xl'
    >
      {value}
    </button>
  )
}
