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
  correctAnswer: 'Saturn',
  answers: ['Jupiter', 'Saturn', 'Neptun', 'Mars', 'Merkur'],
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userSelectedOption, setUserSelectedOption] = useState<string | null>(null)

  const currentQuestion = quizQuestions[currentQuestionIndex]

  function submitAnswer(value: string) {
    const isAnswerCorrect = value === currentQuestion.correctAnswer
    const updatedAnswers = [...userAnswers]
    updatedAnswers[currentQuestionIndex] = isAnswerCorrect
    setUserAnswers(updatedAnswers)
    setUserSelectedOption(value)
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
        <div className='relative w-full aspect-[3_/_2] sm:w-2/3 mb-4'>
          <Image src={currentQuestion.imgUrl} alt='Image for quiz question' width={600} height={400} />
        </div>
      )}
      <ul className='grid grid-cols-2 w-full gap-2 gap-y-3 sm:grid-cols-1 sm:gap-3'>
        {currentQuestion.answers.map((answer) => {
          let colorTheme: 'correct' | 'user-correct' | 'user' | undefined
          if (userSelectedOption) {
            if (answer === currentQuestion.correctAnswer) {
              colorTheme = 'correct'
            }
            if (answer === userSelectedOption) {
              colorTheme = 'user'
            }
            if (userSelectedOption === currentQuestion.correctAnswer && answer === userSelectedOption) {
              colorTheme = 'user-correct'
            }
          }
          return (
            <li key={answer}>
              <AnswerButton disabled={!!userSelectedOption} value={answer} colorTheme={colorTheme} onClick={() => submitAnswer(answer)} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
