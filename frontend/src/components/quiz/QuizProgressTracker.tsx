import AnswerIndicator from './AnswerIndicator'

type QuizProgressTrackerProps = {
  answers: Array<boolean | 'current' | undefined>
}

export default function QuizProgressTracker({ answers }: QuizProgressTrackerProps) {
  return (
    <div className='flex gap-4'>
      {answers.map((a, index) => (
        <AnswerIndicator key={index} answer={a} />
      ))}
    </div>
  )
}
