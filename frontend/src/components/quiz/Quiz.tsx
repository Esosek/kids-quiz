import { Subcategory } from '@/types/subcategory'
import { generateQuiz } from '@/utils/quiz_generator'
import { useMemo, useState } from 'react'
import QuizProgressTracker from './QuizProgressTracker'
import Image from 'next/image'
import AnswerButton from './AnswerButton'

type QuizProps = {
  subcategory: Subcategory
}

const testQuestion = {
  id: 'd4e5f6g7-h890-4123-8456-i78901234567',
  correctAnswer: 'Jupiter',
  answers: ['Saturn', 'Jupiter', 'Neptun', 'Mars', 'Merkur'],
  imgUrl:
    'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/question_images%2Fvesmir_hd.png?alt=media&token=f04a301f-5d55-4926-9f1f-64058f97477c',
  text: 'Co je to za planetu?',
  hasUserAnswered: false,
  subcategoryId: '0043417e-e04b-4bd5-b940-bf8ef8b02e1f',
}

export default function Quiz({ subcategory }: QuizProps) {
  const quizQuestions = useMemo(() => generateQuiz(subcategory.questions), [subcategory.questions])
  quizQuestions[0] = testQuestion // Testing purposes
  const [userAnswers, setUserAnswers] = useState<Array<boolean | undefined>>(Array(quizQuestions.length).fill(undefined))
  // const [currentQuestion, setCurrentQuestion] = useState(quizQuestions[0])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null)

  const currentQuestion = quizQuestions[currentQuestionIndex]

  function submitAnswer(isAnswerCorrect: boolean) {
    const updatedAnswers = [...userAnswers]
    updatedAnswers[currentQuestionIndex] = isAnswerCorrect
    setUserAnswers(updatedAnswers)
  }

  function handleNextQuestion() {
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  return (
    <>
      <h1 className='absolute top-8 text-2xl uppercase mb-6 sm:top-16'>{subcategory.label}</h1>
      <QuizProgressTracker answers={userAnswers} />
      {currentQuestion.text && <p className='uppercase text-lg my-4 text-center sm:my-8'>{currentQuestion.text}</p>}
      {currentQuestion.imgUrl && (
        <div className='relative w-full aspect-[3_/_2] sm:w-2/3 mb-4 border-2 border-red-500'>
          <Image src={currentQuestion.imgUrl} alt='Image for quiz question' width={600} height={400} />
        </div>
      )}
      <ul className='grid grid-cols-2 w-full gap-2 gap-y-3 sm:grid-cols-1 sm:gap-3'>
        {currentQuestion.answers.map((answer) => (
          <li key={answer}>
            <AnswerButton value={answer} onClick={() => {}} />
          </li>
        ))}
      </ul>
    </>
  )
}
