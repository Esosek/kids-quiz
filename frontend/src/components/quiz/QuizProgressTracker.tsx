import AnswerIndicator from './AnswerIndicator'

type QuizProgressTrackerProps = {
  answers: Array<boolean | undefined>
}

export default function QuizProgressTracker({ answers }: QuizProgressTrackerProps) {
  const currentIndex = answers.findIndex((a) => a === undefined)
  return (
    <div className='flex gap-4'>
      {answers.map((a, index) => (
        <AnswerIndicator key={index} answer={index === currentIndex ? 'current' : a} />
      ))}
    </div>
  )
}
