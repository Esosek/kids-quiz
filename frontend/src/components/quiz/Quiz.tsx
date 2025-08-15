import Image from 'next/image'
import { useMemo, useState } from 'react'

import { Subcategory } from '@/types/subcategory'
import { generateQuiz } from '@/utils/quiz_generator'
import QuizProgressTracker from './QuizProgressTracker'
import AnswerButton from './AnswerButton'
import iconChevron from '@/assets/icon_chevron.svg'
import IconButton from '../common/IconButton'
import QuizResult from './QuizResult'

type QuizProps = {
  subcategory: Subcategory
}

export default function Quiz({ subcategory }: QuizProps) {
  const [quizQuestions, setQuizQuestions] = useState(useMemo(() => generateQuiz(subcategory.questions), [subcategory.questions]))
  const [userAnswers, setUserAnswers] = useState<Array<boolean | undefined>>(Array(quizQuestions.length).fill(undefined))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userSelectedOption, setUserSelectedOption] = useState<string | null>(null)
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [currencyEarned, setCurrencyEarned] = useState(0)

  const currentQuestion = quizQuestions[currentQuestionIndex]

  function submitAnswer(value: string) {
    const isAnswerCorrect = value === currentQuestion.correctAnswer
    const updatedAnswers = [...userAnswers]
    updatedAnswers[currentQuestionIndex] = isAnswerCorrect
    setUserAnswers(updatedAnswers)
    setUserSelectedOption(value)
    if (isAnswerCorrect) {
      setCurrencyEarned((cur) => cur + 1) // Currently each answer earns +1 currency
    }
  }

  function handleNextQuestion() {
    // Check if last question
    if (currentQuestionIndex + 1 >= quizQuestions.length) {
      setIsQuizFinished(true)
      setCurrencyEarned((cur) => cur + 5) // Finishing quiz earns +5 currency
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
    setUserSelectedOption(null)
  }

  function handleReplay() {
    setQuizQuestions(generateQuiz(subcategory.questions))
    setUserAnswers(Array(quizQuestions.length).fill(undefined))
    setCurrentQuestionIndex(0)
    setCurrencyEarned(0)
    setIsQuizFinished(false)
  }

  let content = (
    <>
      {currentQuestion.text && <p className='uppercase text-lg my-4 text-center sm:my-8'>{currentQuestion.text}</p>}
      {currentQuestion.imgUrl && (
        <div className='relative w-full aspect-[3_/_2] mb-4 sm:w-2/3'>
          <Image src={currentQuestion.imgUrl} alt='Image for quiz question' width={600} height={400} className='h-auto rounded-2xl' />
        </div>
      )}
      <ul className='absolute bottom-8 left-6 right-6 grid grid-cols-2 gap-2 gap-y-3 sm:grid-cols-1 sm:gap-3'>
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
        {userSelectedOption && (
          <div className='flex items-center self-center justify-self-center sm:absolute sm:-right-24 sm:top-0 sm:bottom-0'>
            <IconButton iconSrc={iconChevron} onClick={handleNextQuestion} alt='Ikona pro pokračování' />{' '}
          </div>
        )}
      </ul>
    </>
  )

  if (isQuizFinished) {
    content = <QuizResult userAnswers={userAnswers as boolean[]} currencyEarned={currencyEarned} onReplay={handleReplay} />
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className='absolute top-8 text-2xl uppercase mb-6 sm:top-16'>{subcategory.label}</h1>
      <QuizProgressTracker currentIndex={currentQuestionIndex} answers={userAnswers} />
      {content}
    </div>
  )
}
