import AnswerIndicator from './AnswerIndicator'

type QuizProgressTrackerProps = {
  currentIndex: number
  answers: Array<boolean | undefined>
}

export default function QuizProgressTracker({ answers, currentIndex }: QuizProgressTrackerProps) {
  return (
    <div className='flex gap-1.5 sm:gap-4 flex-wrap justify-center'>
      {answers.map((a, index) => (
        <AnswerIndicator key={index} answer={index === currentIndex && a === undefined ? 'current' : a} />
      ))}
    </div>
  )
}
